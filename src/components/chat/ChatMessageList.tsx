import { useEffect, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useChatStore } from '../../store/chatStore.ts'
import { ChatMessageBubble } from './ChatMessageBubble'

/** Насколько близко к низу считаем «пользователь внизу» */
const NEAR_BOTTOM_THRESHOLD = 150

export function ChatMessageList() {
    const messages = useChatStore((s) => s.messages)
    const parentRef = useRef<HTMLDivElement>(null)
    const stickToBottomRef = useRef(true)

    const virtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 56, // примерная высота одного бабла
        overscan: 12,
        // измеряем реальную высоту — важно для сообщений разной длины
        measureElement: (el) => el.getBoundingClientRect().height,
        getItemKey: (index) => messages[index].id,
    })

    // Следим, находится ли пользователь у нижней границы
    useEffect(() => {
        const el = parentRef.current
        if (!el) return

        function onScroll() {
            if (!el) return
            const distance = el.scrollHeight - el.scrollTop - el.clientHeight
            stickToBottomRef.current = distance < NEAR_BOTTOM_THRESHOLD
        }

        el.addEventListener('scroll', onScroll, { passive: true })
        return () => el.removeEventListener('scroll', onScroll)
    }, [])

    // Автоскролл вниз при новых сообщениях — только если пользователь «внизу»
    useEffect(() => {
        if (messages.length === 0) return
        if (stickToBottomRef.current) {
            virtualizer.scrollToIndex(messages.length - 1, { align: 'end' })
        }
    }, [messages.length, virtualizer])

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
                Нет сообщений
            </div>
        )
    }

    return (
        <div
            ref={parentRef}
            className="flex-1 overflow-y-auto px-2 sm:px-4 py-3"
            style={{background: 'rgba(0,0,0, 0.1)'}}
        >
            <div
                style={{
                    height: virtualizer.getTotalSize(),
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualizer.getVirtualItems().map((vItem) => {
                    const message = messages[vItem.index]
                    return (
                        <div
                            key={message.id}
                            data-index={vItem.index}
                            ref={virtualizer.measureElement}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${vItem.start}px)`,
                            }}
                        >
                            <ChatMessageBubble message={message} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}