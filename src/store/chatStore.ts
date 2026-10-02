import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Message } from '../types/message'

export interface ChatState {
    phoneNumber: string
    chatId: number | null
    messages: Message[]

    setPhoneNumber: (phone: string) => void
    setChatId: (chatId: number | null) => void
    addMessage: (message: Message) => void
    updateMessage: (id: string, patch: Partial<Message>) => void
    setMessages: (messages: Message[]) => void
    reset: () => void
}

const initialState = {
    phoneNumber: '',
    chatId: null as number | null,
    messages: [] as Message[],
}

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            ...initialState,

            setPhoneNumber: (phone) =>
                set({ phoneNumber: phone.replace(/\D/g, '') }),

            setChatId: (chatId) =>
                set({ chatId, messages: [] }), // при смене чата чистим ленту

            addMessage: (message) =>
                set((s) => ({ messages: [...s.messages, message] })),

            updateMessage: (id, patch) =>
                set((s) => ({
                    messages: s.messages.map((m) =>
                        m.id === id ? { ...m, ...patch } : m,
                    ),
                })),

            setMessages: (messages) => set({ messages: sortMessagesByTime(messages) }),

            reset: () => set(initialState),
        }),
        {
            name: 'greenapi.chat',
            storage: createJSONStorage(() => localStorage),

            // partialize: (state) => ({
            //     // phoneNumber: state.phoneNumber,
            //     // chatId: state.chatId,
            // }),
        },
    ),
)

function sortMessagesByTime (messages: Message[]) {
    return messages.sort((a, b) => a.timestamp - b.timestamp)
}