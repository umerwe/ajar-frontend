"use client"

import ChatConversation from "@/components/chat/chat-converstion";
import ChatList from "@/components/chat/chat-list";
import { useParams } from "next/navigation";

const ChatConversationPage = () => {
    const { id } = useParams();

    return (
        <div className="flex h-screen w-full bg-gray-100">
            <div className="w-full max-w-sm border-r bg-white">
                <ChatList id={id as string} />
            </div>

            <ChatConversation id={id as string} />
        </div>
    )
}

export default ChatConversationPage