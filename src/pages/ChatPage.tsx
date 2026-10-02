import {ChatLayout} from "../components/chat/ChatLayout.tsx";
import {ChatHeader} from "../components/chat/ChatHeader.tsx";
import {ChatMessageList} from "../components/chat/ChatMessageList.tsx";
import {ChatInput} from "../components/chat/ChatInput.tsx";
import {useEffect} from "react";

const ChatPage = () => {

    useEffect(() => {

    })

    return (
        <ChatLayout>
            <ChatHeader />
            <ChatMessageList />
            <ChatInput />
        </ChatLayout>
    );
};

export default ChatPage;