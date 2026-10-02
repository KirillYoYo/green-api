import { getCredentials } from '../auth/auth'

const DEFAULT_BASE_URL = '/green-api'

export class GreenApiError extends Error {
    status: number
    code?: number
    description?: string

    constructor(message: string, status: number, code?: number, description?: string) {
        super(message)
        this.name = 'GreenApiError'
        this.status = status
        this.code = code
        this.description = description
    }
}

function getBaseUrl(): string {
    return import.meta.env.VITE_GREEN_API_URL ?? DEFAULT_BASE_URL
}

// ─── Тип описания пути ────────────────────────────────────
/**
 * - строка — короткий способ, эквивалент `{ method: <строка>, token: 'end' }`
 *   (обратная совместимость со старыми вызовами);
 * - объект — расширенный способ, когда нужно управлять положением токена
 *   и/или добавить хвостовой сегмент после токена.
 */
export type PathSpec =
    | string
    | {
    /** Например 'receiveNotification', 'deleteNotification', 'sendMessage' */
    method: string
    /**
     * Где стоит apiTokenInstance в пути:
     * - 'end'            → .../{method}/{token}                     (по умолчанию)
     * - 'before-suffix'  → .../{method}/{token}/{suffix}            (deleteNotification)
     * - 'none'           → .../{method}[/{suffix}]  (без токена)
     */
    token?: 'end' | 'before-suffix' | 'none'
    /** Хвостовой сегмент после токена (например, receiptId). */
    suffix?: string | number
}

function buildUrl(
    path: PathSpec,
    query?: Record<string, string | number>,
): string {
    const creds = getCredentials()
    if (!creds) throw new GreenApiError('Нет авторизации', 401)

    const { idInstance, apiTokenInstance } = creds

    // ── нормализуем вход: строка → объект с дефолтами ──
    const spec =
        typeof path === 'string'
            ? { method: path, token: 'end' as const, suffix: undefined as string | number | undefined }
            : { token: 'end' as const, suffix: undefined as string | number | undefined, ...path }

    const { method, token, suffix } = spec

    // ── собираем сегменты пути ─────────────────────────
    const segments: string[] = [`waInstance${idInstance}`, method]

    if (token === 'before-suffix') {
        segments.push(apiTokenInstance)
        if (suffix !== undefined) segments.push(String(suffix))
    } else if (token === 'end') {
        if (suffix !== undefined) segments.push(String(suffix))
        segments.push(apiTokenInstance)
    } else {
        // token === 'none'
        if (suffix !== undefined) segments.push(String(suffix))
    }

    const base = `${getBaseUrl()}/${segments.filter(Boolean).join('/')}`

    // ── query-строка ───────────────────────────────────
    if (!query || Object.keys(query).length === 0) return base

    const qs = new URLSearchParams(
        Object.entries(query).map(([k, v]) => [k, String(v)]),
    ).toString()

    return `${base}?${qs}`
}

interface RequestOptions {
    query?: Record<string, string | number>
    body?: unknown
    signal?: AbortSignal
    /** Дополнительные заголовки, мержатся с дефолтными */
    headers?: Record<string, string>
}

export async function apiRequest<T>(
    path: PathSpec,                       // ← было: method: string
    httpMethod: 'GET' | 'POST' | 'DELETE',
    { query, body, signal, headers }: RequestOptions = {},
): Promise<T> {
    const url = buildUrl(path, query)

    // ─── Собираем заголовки ─────────────────────────────
    const finalHeaders = new Headers()

    if (body !== undefined) {
        finalHeaders.set('Content-Type', 'application/json')
    }

    finalHeaders.set('Accept', 'application/json')

    if (headers) {
        for (const [key, value] of Object.entries(headers)) {
            finalHeaders.set(key, value)
        }
    }

    const res = await fetch(url, {
        method: httpMethod,
        headers: finalHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
    })

    const text = await res.text()
    let data: unknown = null
    try {
        data = text ? JSON.parse(text) : null
    } catch {
        data = text
    }

    if (!res.ok) {
        const err = (data ?? {}) as { code?: number; description?: string; message?: string }
        throw new GreenApiError(
            err.description ?? err.message ?? `HTTP ${res.status}`,
            res.status,
            err.code,
            err.description,
        )
    }

    return data as T
}