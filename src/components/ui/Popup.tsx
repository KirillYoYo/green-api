import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface PopupProps {
    open: boolean
    onClose: () => void
    title?: ReactNode
    children: ReactNode
    footer?: ReactNode
    /** Закрывать по клику на оверлей. По умолчанию — true */
    closeOnOverlay?: boolean
    /** Закрывать по Esc. По умолчанию — true */
    closeOnEsc?: boolean
    /** Размер попапа */
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const sizeClasses: Record<NonNullable<PopupProps['size']>, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
}

export function Popup({
                          open,
                          onClose,
                          title,
                          children,
                          footer,
                          closeOnOverlay = true,
                          closeOnEsc = true,
                          size = 'md',
                          className = '',
                      }: PopupProps) {
    const panelRef = useRef<HTMLDivElement>(null)

    // Esc + блокировка скролла body
    useEffect(() => {
        if (!open) return

        function handleKey(e: KeyboardEvent) {
            if (closeOnEsc && e.key === 'Escape') {
                e.stopPropagation()
                onClose()
            }
        }

        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleKey)

        return () => {
            document.body.style.overflow = prevOverflow
            document.removeEventListener('keydown', handleKey)
        }
    }, [open, closeOnEsc, onClose])

    // Фокус на панель при открытии
    useEffect(() => {
        if (open) panelRef.current?.focus()
    }, [open])

    if (!open) return null

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            {/* Оверлей */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
                onClick={closeOnOverlay ? onClose : undefined}
            />

            {/* Панель */}
            <div
                ref={panelRef}
                tabIndex={-1}
                className={[
                    'relative w-full rounded-2xl bg-white shadow-xl',
                    'animate-[popIn_150ms_ease-out] focus:outline-none',
                    sizeClasses[size],
                    className,
                ].join(' ')}
            >
                {(title !== undefined) && (
                    <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Закрыть"
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="px-5 py-4 text-sm text-gray-700">{children}</div>

                {footer && (
                    <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
                        {footer}
                    </div>
                )}
            </div>

            {/* keyframes, если у вас не настроен tailwind-animate */}
            <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn  { from { opacity: 0; transform: translateY(8px) scale(.98) }
                            to   { opacity: 1; transform: translateY(0)   scale(1)  } }
      `}</style>
        </div>,
        document.body,
    )
}