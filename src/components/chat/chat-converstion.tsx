"use client";

import { useGetMessages } from "@/hooks/useChat";
import { socket } from "@/lib/socket";
import Image from "next/image";
import { useUser } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { capitalizeWords } from "@/utils/capitalizeWords";
import SendMessage from "./send-message";
import SkeletonLoader from "../common/skeleton-loader";
import { Message, MessagePayload } from "@/types/chat";

const ChatConversation = ({ id: chatId }: { id?: string }) => {
  const { data: user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);

  const [isChatActive, setIsChatActive] = useState(false);
  const { data, isLoading } = useGetMessages(chatId as string);
  const scrollRef = useRef<HTMLDivElement>(null);

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
          msg._id === data.messageId ? { ...msg, readAt: new Date(data.readAt), seen: true } : msg
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

  const handleSend = ({ text, fileUrls }: { text?: string; fileUrls?: string[] }) => {
    if (!user || !chatId || !data?.receiver?._id) return;

    const payload: MessagePayload = {
      chatId,
      receiver: data.receiver._id,
    };

    if (text) payload.text = text;
    if (fileUrls && fileUrls.length > 0) payload.attachments = fileUrls;

    socket?.emit("message:send", payload);
  };

  // Helper to determine message type
  const getMessageType = (msg: Message) => {
    const hasText = !!msg.text?.trim();
    const hasAttachments = msg.attachments && msg.attachments.length > 0;

    if (hasText && hasAttachments) return "mixed";
    if (hasAttachments) return "media";
    return "text";
  };

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
                src={process.env.NEXT_PUBLIC_API_BASE_URL + data?.receiver?.profilePicture}
                alt={data?.receiver?.name || "User"}
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3">
        {isLoading && messages.length === 0 && (
          <SkeletonLoader variant="messages" count={6} />
        )}

        {messages?.filter(msg => msg.chatId === chatId)?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())?.map((msg) => {
          const isSent = msg.sender?._id === user?._id;
          const sender = msg.sender || {};
          const hasImage = sender.profilePicture;
          const messageType = getMessageType(msg);

          return (
            <div
              key={msg._id}
              className={`flex ${isSent ? "justify-end" : "justify-start"} group`}
            >
              <div className={`flex gap-2 max-w-[70%] ${isSent ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {hasImage ? (
                    <Image
                      src={(process.env.NEXT_PUBLIC_API_BASE_URL || "") + (sender?.profilePicture || "")}
                      alt={sender?.name || "User"}
                      width={256}
                      height={256}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-aqua flex items-center justify-center text-white text-sm font-semibold">
                      {sender.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col ${isSent ? "items-end" : "items-start"}`}>
                  {/* Sender Name */}
                  {!isSent && (
                    <div className="text-xs font-medium text-gray-500 mb-1 px-2">
                      {capitalizeWords(sender.name)}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-2 ${isSent
                      ? "bg-aqua text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                      } ${messageType === "mixed" ? "space-y-3" : ""}`}
                  >
                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className={`grid gap-2 ${msg.attachments.length > 1 ? "grid-cols-2" : ""}`}>
                        {msg.attachments.map((fileUrl, idx) => (
                          <div key={idx} className="relative">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${fileUrl}`}
                              alt="attachment"
                              width={200}
                              height={200}
                              className="rounded-lg object-cover w-full h-auto max-w-[150px]"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Text Content */}
                    {msg.text && (
                      <div className={`${messageType === "media" ? "mt-2" : ""}`}>
                        <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className={`text-[10px] text-gray-400 mt-1 px-2 ${isSent ? "text-right" : "text-left"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {!isLoading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-sm">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1">Start a conversation</p>
          </div>
        )}
      </div>

      {/* ---------------- INPUT ---------------- */}
      <SendMessage
        onSend={handleSend}
        isSending={false}
        chatId={chatId}
        receiverId={data?.receiver?._id}
      />
    </div>
  );
};

export default ChatConversation;