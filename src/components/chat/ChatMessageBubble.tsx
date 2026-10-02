import type {Message, MessageStatus} from '../../types/message'

function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

const statusIcon: Record<NonNullable<Message['statusMessage']>, string> = {
    sending: '○',
    delivered: '✓',
    read: '✓✓',
    failed: '!',
}

export function ChatMessageBubble({ message }: { message: Message }) {
    const { type, timestamp, senderName, textMessage, statusMessage } = message

    const outgoing = type === 'outgoing'

    return (
        <div className={`flex ${outgoing ? 'justify-end' : 'justify-start'} mb-1.5`}>
            <div
                className={[
                    'max-w-[75%] sm:max-w-[60%] rounded-2xl px-3 py-2 text-sm',
                    'shadow-sm break-words whitespace-pre-wrap',
                    outgoing
                        ? 'bg-[#effdde] text-gray-900 rounded-br-md'
                        : 'bg-white text-gray-900 rounded-bl-md',
                    status === 'failed' && 'bg-red-50',
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                {!outgoing && senderName && (
                    <div className="text-xs font-medium text-blue-600 mb-0.5">
                        {senderName}
                    </div>
                )}

                <div className="leading-snug">{textMessage}</div>

                <div className="flex items-center justify-end gap-1 mt-0.5 -mb-0.5 text-[11px] text-gray-500">
                    <span>{formatTime(timestamp)}</span>
                    {outgoing && statusMessage && (
                        <span
                            className={
                                statusMessage === 'read' ? 'text-blue-500' : 'text-gray-400'
                            }
                        >
              {statusIcon[statusMessage as MessageStatus]}
            </span>
                    )}
                </div>
            </div>
        </div>
    )
}