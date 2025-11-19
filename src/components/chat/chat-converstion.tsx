"use client";

import { useGetMessages } from "@/hooks/useChat";
import { socket } from "@/lib/socket";
import Image from "next/image";
import { useUser } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { capitalizeWords } from "@/utils/capitalizeWords";
import SendMessage from "./send-message";
import SkeletonLoader from "../common/skeleton-loader";
import { Message } from "@/types/chat";

const ChatConversation = ({ id: chatId }: { id?: string }) => {
  const { data: user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatActive, setIsChatActive] = useState(false);

  const { data, isLoading } = useGetMessages(chatId as string);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ Load all messages from backend
  useEffect(() => {
    if (data?.messages?.length) {
      setMessages(data.messages.reverse());
    }
  }, [data]);

  // ✅ Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!isLoading && messages.length > 0 && scrollRef.current) {
      const container = scrollRef.current;
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 100);
    }
  }, [messages, isLoading]);

  // ✅ SOCKET integration
  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("chat:join", { chatId });
    setIsChatActive(true);

    const handleMessageSent = (message: Message) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const handleMessageReceived = (message: Message) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id)) return prev;
        return [...prev, message];
      });

      if (isChatActive && document.visibilityState === "visible") {
        socket?.emit("message:deliver", { messageId: message._id });
      }
    };

    const handleMessageDelivered = (data: { messageId: string; deliveredAt: Date }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? { ...msg, deliveredAt: new Date(data.deliveredAt) }
            : msg
        )
      );
    };

    const handleMessageRead = (data: { messageId: string; readAt: Date }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, readAt: new Date(data.readAt) } : msg
        )
      );
    };

    socket.on("message:sent", handleMessageSent);
    socket.on("message:received", handleMessageReceived);
    socket.on("message:delivered", handleMessageDelivered);
    socket.on("message:read", handleMessageRead);

    return () => {
      socket?.off("message:sent", handleMessageSent);
      socket?.off("message:received", handleMessageReceived);
      socket?.off("message:delivered", handleMessageDelivered);
      socket?.off("message:read", handleMessageRead);
      socket?.emit("chat:leave", { chatId });
      setIsChatActive(false);
    };
  }, [chatId, isChatActive]);

  // ✅ Send new message through socket only
  const handleSend = (text: string) => {
    if (!user || !chatId || !data?.receiver?._id) return;
    socket?.emit("message:send", {
      chatId,
      receiver: data.receiver._id,
      text,
    });
  };

  // ✅ Render UI
  return (
    <div className="flex flex-col h-full w-full bg-white border shadow">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex items-center gap-3 p-4 border-b">
        {isLoading ? (
          <>
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </>
        ) : (
          <>
            {data?.receiver?.profilePicture ? (
              <Image
                src={"https://ajar-server.hostdonor.com" + data.receiver.profilePicture}
                alt={data.receiver?.name || "User"}
                width={256}
                height={256}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-aqua flex items-center justify-center text-white font-semibold text-lg">
                {data?.receiver?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold">{capitalizeWords(data?.receiver?.name)}</p>
            </div>
          </>
        )}
      </div>

      {/* ---------------- MESSAGES ---------------- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && messages.length === 0 && (
          <SkeletonLoader variant="messages" count={6} />
        )}

        {messages.map((msg) => {
          const isSent = msg.sender?._id === user?._id;
          const sender = msg.sender || {};
          const hasImage = sender.profilePicture;
          const avatarUrl = hasImage
            ? "https://ajar-server.hostdonor.com" + sender.profilePicture
            : "";

          return (
            <div
              key={msg._id}
              className={`flex ${isSent ? "justify-end" : "justify-start"} mb-5`}
            >
              <div
                className={`flex flex-col relative ${
                  isSent ? "items-end text-right" : "items-start text-left"
                }`}
              >
                {/* Avatar */}
                <div className={`absolute ${isSent ? "right-0" : "left-0"} top-9`}>
                  {hasImage ? (
                    <Image
                      src={avatarUrl}
                      alt={sender.name || "User"}
                      width={256}
                      height={256}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-aqua flex items-center justify-center text-white text-sm font-semibold">
                      {sender.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div
                  className={`mt-9 text-xs font-medium text-gray-500 ${
                    isSent ? "pr-10" : "pl-10"
                  }`}
                >
                  {isSent ? "You" : capitalizeWords(sender.name)}
                </div>

                {/* Message Bubble */}
                <div
                  className={`mt-1 px-3 py-2 rounded-lg text-sm max-w-xs ${
                    isSent
                      ? "bg-aqua text-white rounded-br-none mr-10"
                      : "bg-gray-100 text-gray-800 rounded-bl-none ml-10"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 ${
                      isSent ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {!isLoading && messages.length === 0 && (
          <p className="text-center text-gray-500 text-sm">No messages yet</p>
        )}
      </div>

      {/* ---------------- INPUT ---------------- */}
      <SendMessage onSend={handleSend} isSending={false} />
    </div>
  );
};

export default ChatConversation;
