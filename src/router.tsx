import { createBrowserRouter, Navigate } from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage.tsx'
import {lazy, Suspense} from "react";
import PageLoader from "./components/ui/PageLoader.tsx";
const LoginPage    = lazyWithMinDelay(() => import('./pages/LoginPage'))
const ChatPage     = lazyWithMinDelay(() => import('./pages/ChatPage'))


const MIN_LOADER_MS = 700

type ModuleWithDefault = { default: React.ComponentType<any> }

export function lazyWithMinDelay<T extends ModuleWithDefault>(
    factory: () => Promise<T>
) {
    return lazy(() =>
        Promise.all([
            factory(),
            new Promise((resolve) => setTimeout(resolve, MIN_LOADER_MS)),
        ]).then(([mod]) => mod)
    )
}

const withSuspense = (node: React.ReactNode) => (
    <Suspense fallback={<PageLoader />}>{node}</Suspense>
)

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/chat" replace />,

    },
    {
        path: '/login',
        element: withSuspense(<LoginPage />),
    },
    {
        path: '/chat',
        element: withSuspense(<ChatPage />),
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
],
    {
        basename: '/green',
    })