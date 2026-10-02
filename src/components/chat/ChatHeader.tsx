import { useNavigate } from 'react-router-dom'
import { useChatStore } from '../../store/chatStore.ts'

export function ChatHeader() {
    const navigate = useNavigate()
    const phoneNumber = useChatStore((s) => s.phoneNumber)


    const title = phoneNumber ? `+${phoneNumber}` : 'Чат'

    return (
        <header className="flex items-center gap-3 h-14 px-3 bg-[#517da2] text-white shadow-sm shrink-0">
            <button
                onClick={() => navigate(-1)}
                aria-label="Назад"
                className="p-2 -ml-1 rounded-full hover:bg-white/10 transition-colors"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-medium">
                {phoneNumber ? phoneNumber.slice(-2) : '?'}
            </div>

            <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{title}</div>
                <div className="text-xs text-white/70">был(а) недавно</div>
            </div>
        </header>
    )
}