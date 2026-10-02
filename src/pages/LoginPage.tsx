import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { isAuthenticated, saveCredentials } from '../auth/auth'

interface LocationState {
    from?: { pathname: string }
}

export function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as LocationState | null
    const from = state?.from?.pathname ?? '/chat'

    const [idInstance, setIdInstance] = useState('')
    const [apiTokenInstance, setApiTokenInstance] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    if (isAuthenticated()) {
        return <Navigate to={from} replace />
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const id = idInstance.trim()
        const token = apiTokenInstance.trim()

        if (!id || !token) {
            setError('Заполните оба поля')
            return
        }
        if (!/^\d+$/.test(id)) {
            setError('idInstance должен состоять только из цифр')
            return
        }

        setSubmitting(true)
        try {
            saveCredentials({ idInstance: id, apiTokenInstance: token })
            navigate(from, { replace: true })
        } catch {
            setError('Не удалось сохранить данные')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-2xl shadow p-8 space-y-5"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Вход в GREEN-API</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Введите данные из личного кабинета green-api.com
                    </p>
                </div>

                <label className="block">
          <span className="block text-sm font-medium text-gray-700">
            idInstance
          </span>
                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={idInstance}
                        onChange={(e) => setIdInstance(e.target.value)}
                        placeholder="1101000000"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </label>

                <label className="block">
          <span className="block text-sm font-medium text-gray-700">
            apiTokenInstance
          </span>
                    <input
                        type="text"
                        autoComplete="off"
                        value={apiTokenInstance}
                        onChange={(e) => setApiTokenInstance(e.target.value)}
                        placeholder="abcdef1234567890..."
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </label>

                {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium
                     hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
                     transition-colors"
                >
                    {submitting ? 'Вход…' : 'Войти'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                    Данные хранятся локально в вашем браузере (localStorage)
                </p>
            </form>
        </div>
    )
}