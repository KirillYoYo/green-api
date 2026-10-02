import {checkAccount, deleteNotification, receiveNotification} from "../api";
import {useChatStore} from "../store/chatStore.ts";
import {getChatHistory} from "../api/greenApi.ts";


const { setChatId, setMessages } = useChatStore.getState()

export async function startChatService(phoneNumber: number) {
    const res = await checkAccount({phoneNumber: Number(phoneNumber)})
    setChatId(res.chatId);
}

// подписка на изменение chatId
useChatStore.subscribe((state, prevState) => {
    if (state.chatId !== prevState.chatId) {
        getChatHistory({ chatId: state.chatId }).then(res => {
            setMessages(res)
            startPolling()
        })
    }
    if (!state.chatId) {
        stopPolling()
    }
})


export function startNotificationPolling(signal: AbortSignal) {
    ;(async () => {
        while (!signal.aborted) {
            try {
                const res = await receiveNotification(5, signal)

                // таймаут — просто идём на следующий круг
                if (!res || !res.body) continue

                const { receiptId, body } = res

                // 1. обрабатываем уведомление (может бросить — тогда НЕ удаляем)
                handleNotification(body)

                // 2. подтверждаем получение
                await deleteNotification(receiptId, signal)
            } catch (e) {
                if (signal.aborted) break
                // пауза, чтобы не долбить сервер при ошибках
                await sleep(1000, signal)
            }
        }
    })()
}

function sleep(ms: number, signal: AbortSignal) {
    return new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms)
        signal.addEventListener('abort', () => {
            clearTimeout(t)
            resolve()
        }, { once: true })
    })
}
type Notification = {
    typeWebhook: string
    idMessage?: string
    senderData?: { chatId: string; senderName?: string; sender?: string }
    messageData?: {
        typeMessage: string
        textMessageData?: { textMessage: string }
        extendedTextMessageData?: { text: string }
    }
    timestamp?: number
    instanceData?: { wid: string }
    // ...другие поля
}

function handleNotification(body: Notification) {
    const store = useChatStore.getState()

    if (store.messages.find(el => el.id === body.idMessage)) {
        return;
    }

    switch (body.typeWebhook) {
        case 'incomingMessageReceived': {
            const chatId = body.senderData?.chatId
            if (!chatId) return

            const text =
                body.messageData?.textMessageData?.textMessage ??
                body.messageData?.extendedTextMessageData?.text ??
                ''

            store.addMessage({
                id: body.idMessage!,
                chatId: Number(chatId),
                textMessage: text,
                type: 'incoming',
                timestamp: body.timestamp ?? Date.now(),
                senderName: body.senderData?.senderName,
                typeMessage: 'textMessage'
            })
            break
        }

        case 'outgoingMessageReceived':
        case 'outgoingAPIMessageReceived': {
            const chatId = body.senderData?.chatId
            if (!chatId) return
            store.addMessage({
                id: body.idMessage!,
                chatId: Number(chatId),
                textMessage: body.messageData?.textMessageData?.textMessage ?? '',
                type: 'outgoing',
                timestamp: body.timestamp ?? Date.now(),
                senderName: body.senderData?.senderName,
                typeMessage: 'textMessage'
            })
            break
        }

        case 'incomingMessageStatus':
        case 'outgoingMessageStatus': {
            // обновить статус сообщения (доставлено/прочитано)
            if (body.idMessage) {
                // store.updateMessageStatus(body.idMessage, body.typeWebhook)
            }
            break
        }

        default:
            // остальные типы можно игнорировать или логировать
            break
    }
}

let controller: AbortController | null = null
export function startPolling() {
    if (controller) return // уже запущено
    controller = new AbortController()
    startNotificationPolling(controller.signal)
}

export function stopPolling() {
    controller?.abort()
    controller = null
}