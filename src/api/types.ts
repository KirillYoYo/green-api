// ─── Общие ────────────────────────────────────────────────

/** Ошибка от GREEN-API (может прийти с любым кодом) */
export interface ApiError {
    code?: number
    description?: string
}

// ─── sendMessage ─────────────────────────────────────────

export type TypingType =
    | 'textMessage'
    | 'recordAudio'
    | 'uploadDocument'
    | 'uploadPhoto'
    | 'uploadVideo'

export interface SendMessageRequest {
    chatId: number
    message: string
    quotedMessageId?: string
    /** 1000–20000 мс */
    typingTime?: number
    typingType?: TypingType
}

export interface SendMessageResponse {
    idMessage: string
}

// ─── receiveNotification ─────────────────────────────────

/** 5–60 секунд, по умолчанию 5 */
export type ReceiveTimeout = number

export interface ReceiveNotificationResponse {
    receiptId: number
    body: {
        typeWebhook: string
        instanceData: {
            idInstance: number
            wid: string
            typeInstance: string
        }
        timestamp: number
        idMessage?: string
        senderData?: {
            chatId: string
            sender: string
            senderName?: string
        }
        messageData?: {
            typeMessage: string
            textMessageData?: {
                textMessage: string
            }
            // ...другие типы сообщений
        }
        [key: string]: unknown
    }
}

// ─── deleteNotification ──────────────────────────────────

export interface DeleteNotificationResponse {
    result: boolean
}

// ─── checkAccount ────────────────────────────────────────

export interface CheckAccountRequest {
    /** Обязателен, если не указан username */
    phoneNumber?: number
    /** Обязателен, если не указан phoneNumber. Начинается с @ */
    username?: string
    /** Игнорировать кэш. По умолчанию false */
    force?: boolean
}

export interface CheckAccountResponse {
    existWhatsapp: boolean
    chatId: number
    fromCache: boolean
}


// ─── getChatHistory ──────────────────────────────────────

export interface GetChatHistoryRequest {
    chatId: number | null
    /** Количество сообщений. По умолчанию 100 */
    count?: number
}

export interface ChatHistoryMessage {
    type: 'incoming' | 'outgoing'
    idMessage: string
    timestamp: number
    chatId: string
    chatType: 'user' | 'group' | 'channel' | 'bot'

    senderName?: string
    senderContactName?: string

    typeMessage: string
    textMessage?: string

    isEdited?: boolean
    isDeleted?: boolean
}