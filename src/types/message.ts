export type MessageStatus = 'sending' | 'failed' | 'read' | 'delivered'

export interface Message {
    id: string
    chatId: number
    textMessage: string
    timestamp: number
    statusMessage?: MessageStatus
    senderName?: string
    typeMessage: 'textMessage'
    type: 'incoming' | 'outgoing' | 'ready'
}