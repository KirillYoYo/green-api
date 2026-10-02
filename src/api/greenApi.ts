import { apiRequest } from './client'
import type {
    CheckAccountRequest,
    CheckAccountResponse,
    DeleteNotificationResponse, GetChatHistoryRequest,
    ReceiveNotificationResponse,
    ReceiveTimeout,
    SendMessageRequest,
    SendMessageResponse,
} from './types'
import type {Message} from "../types/message.ts";

// ─── Отправка сообщения ──────────────────────────────────

export function sendMessage(
    payload: SendMessageRequest,
    signal?: AbortSignal,
): Promise<SendMessageResponse> {
    // лёгкая защита от превышения лимита в 4096 символов
    if (payload.message.length > 4096) {
        throw new Error('Сообщение длиннее 4096 символов')
    }
    if (
        payload.typingTime !== undefined &&
        (payload.typingTime < 1000 || payload.typingTime > 20000)
    ) {
        throw new Error('typingTime должен быть от 1000 до 20000 мс')
    }

    return apiRequest<SendMessageResponse>('sendMessage', 'POST', {
        body: payload,
        signal,
    })
}

// ─── Получение уведомления (long-poll) ───────────────────

export function receiveNotification(
    receiveTimeout: ReceiveTimeout = 5,
    signal?: AbortSignal,
): Promise<ReceiveNotificationResponse> {
    if (receiveTimeout < 5 || receiveTimeout > 60) {
        throw new Error('receiveTimeout должен быть от 5 до 60 секунд')
    }

    return apiRequest<ReceiveNotificationResponse>(
        'receiveNotification',
        'GET',
        { query: { receiveTimeout }, signal },
    )
}

// ─── Удаление уведомления ────────────────────────────────

export function deleteNotification(
    receiptId: number,
    signal?: AbortSignal,
): Promise<DeleteNotificationResponse> {
    return apiRequest<DeleteNotificationResponse>(
        {
            method: 'deleteNotification',
            token: 'before-suffix',
            suffix: receiptId,
        },
        'DELETE',
        { signal },
    )
}

// ─── Проверка аккаунта ───────────────────────────────────

export function checkAccount(
    payload: CheckAccountRequest,
    signal?: AbortSignal,
): Promise<CheckAccountResponse> {
    if (!payload.phoneNumber && !payload.username) {
        throw new Error('Нужен phoneNumber или username')
    }

    return apiRequest<CheckAccountResponse>('checkAccount', 'POST', {
        body: payload,
        signal,
        headers: {
            'X-Request-Id': crypto.randomUUID(),
            'X-Client-Version': '1.0.0',
        },
    })
}


export function getChatHistory(
    payload: GetChatHistoryRequest,
    signal?: AbortSignal,
): Promise<Message[]> {
    if (!payload.chatId) {
        throw new Error('Нужен chatId')
    }

    if (
        payload.count !== undefined &&
        (payload.count < 1 || payload.count > 5000)
    ) {
        throw new Error('count должен быть от 1 до 5000')
    }

    return apiRequest<Message[]>(
        'getChatHistory',
        'POST',
        {
            body: payload,
            signal,
        },
    )
}