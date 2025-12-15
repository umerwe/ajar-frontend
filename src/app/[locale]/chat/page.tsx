"use client";

import ChatConversation from "@/components/chat/chat-converstion";
import ChatList from "@/components/chat/chat-list";
import { useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const ChatPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      <div
        className={cn(
          "h-full flex-col bg-white border-r",
          id ? "hidden md:flex md:w-[350px]" : "flex w-full md:w-[350px]"
        )}
      >
        <ChatList id={id || ""} />
      </div>

      <div
        className={cn(
          "h-full flex-col bg-white",
          id ? "flex w-full md:flex-1" : "hidden md:flex md:flex-1"
        )}
      >
        {id ? (
          <ChatConversation id={id} />
        ) : (
          <div className="flex-1 bg-white flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-1">
              No Chat Selected
            </h2>
            <p className="text-gray-500 text-sm max-w-sm">
              Select a conversation to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;