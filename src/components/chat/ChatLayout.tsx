import React, {useState} from 'react';
import {type ReactNode, useEffect} from 'react'
import ChatBg from "./ChatBg.tsx";
import {useChatStore} from "../../store/chatStore.ts";
import PhoneNumberPopup from "./PhoneNumberPopup.tsx";
import PageLoader from "../ui/PageLoader.tsx";

interface ChatLayoutProps {
    children: ReactNode
}

export const ChatLayout = ({children}: ChatLayoutProps) => {

    const [isLoaded, setIsLoaded] = React.useState<boolean>(false)
    const phoneNumber = useChatStore((s) => s.phoneNumber)
    const [isOpen, setIsOpen] = React.useState(false)
    const [isStartLoading, setIstartLoading] = useState(false)
    const [isEndLoading, setIEndLoading] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])
    useEffect(() => {
        if (!isLoaded && !phoneNumber) {
            setIsOpen(true)
        }
    }, [isLoaded]);



    return (
        <div className="text-slate-50 flex flex-col h-screen bg-[#e6ebee]">

            {isStartLoading && !isEndLoading ? (
                <div style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0}}>
                    <PageLoader></PageLoader>
                </div>
            ) : null}

            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Назад"
                className="absolute right-10 top-6 z-10 inline-flex items-center justify-center
                 p-2 rounded-lg text-gray-600 cursor-pointer
                 hover:bg-gray-100 hover:text-gray-900
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 transition-colors"
            >
                {phoneNumber || 'Введите номер!'}
            </button>
            <PhoneNumberPopup setIstartLoading={setIstartLoading} setIEndLoading={setIEndLoading} open={isOpen} setOpen={setIsOpen} />
            <main className="flex-1 flex flex-col px-4 py-3 min-h-0">
                <div className="mx-auto w-full max-w-4xl flex-1 flex flex-col gap-3 min-h-0 z-1">
                    {children}
                </div>
                {<ChatBg/>}
            </main>
        </div>
    )
}