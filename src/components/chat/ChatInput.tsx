import { useRef, useState, type KeyboardEvent } from 'react'
import { useChatStore } from '../../store/chatStore.ts'
import { sendMessage } from '../../api'

export function ChatInput() {
    const [text, setText] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const chatId = useChatStore((s) => s.chatId)
    const addMessage = useChatStore((s) => s.addMessage)
    const updateMessage = useChatStore((s) => s.updateMessage)

    function autoresize() {
        const el = textareaRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }

    async function handleSend() {
        const trimmed = text.trim()
        if (!trimmed || !chatId) return

        const tempId = `tmp-${Date.now()}`
        addMessage({
            id: tempId,
            chatId,
            textMessage: trimmed,
            timestamp: Date.now() as number,
            statusMessage: 'sending', // todo проверить можно ли тут писать такие статусы
            typeMessage: 'textMessage',
            type: 'outgoing'
        })

        setText('')
        requestAnimationFrame(autoresize)

        try {
            const { idMessage } = await sendMessage({ chatId, message: trimmed })
            updateMessage(tempId, { id: idMessage, statusMessage: 'delivered' })
        } catch {
            updateMessage(tempId, { statusMessage: 'failed' })
        }
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            void handleSend()
        }
    }

    return (
        <div className="shrink-0 bg-[#e6ebee] px-2 sm:px-4 py-2">
            <div className="flex items-end gap-2 rounded-3xl bg-white shadow-sm px-3 py-2">
        <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
                setText(e.target.value)
                autoresize()
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Написать сообщение…"
            className="flex-1 resize-none bg-transparent text-sm text-gray-900
                     placeholder:text-gray-400
                     focus:outline-none max-h-40 py-1.5"
        />

                <button
                    type="button"
                    onClick={handleSend}
                    disabled={!text.trim() || !chatId}
                    aria-label="Отправить"
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                     bg-[#517da2] text-white
                     hover:bg-[#466e90]
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2 11 13" />
                        <path d="M22 2 15 22l-4-9-9-4Z" />
                    </svg>
                </button>
            </div>
        </div>
    )
}