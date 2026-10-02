const STORAGE_KEY = 'greenapi.credentials'

export interface Credentials {
    idInstance: string
    apiTokenInstance: string
}

export function getCredentials(): Credentials | null {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw) as Partial<Credentials>
        if (!parsed.idInstance || !parsed.apiTokenInstance) return null
        return {
            idInstance: String(parsed.idInstance),
            apiTokenInstance: String(parsed.apiTokenInstance),
        }
    } catch {
        return null
    }
}

export function saveCredentials(creds: Credentials): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creds))
}

export function clearCredentials(): void {
    localStorage.removeItem(STORAGE_KEY)
}

export function isAuthenticated(): boolean {
    return getCredentials() !== null
}