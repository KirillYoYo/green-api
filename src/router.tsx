import { createBrowserRouter, Navigate } from 'react-router-dom'
import ChatPage from './pages/ChatPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import {LoginPage} from "./pages/LoginPage.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/chat" replace />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/chat',
        element: <ChatPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
])