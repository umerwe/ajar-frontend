"use client";

import { useGetMessages } from "@/hooks/useChat";
import Image from "next/image";
import { useUser } from "@/hooks/useAuth";
import { useEffect, useRef, useState, useCallback } from "react";
import { capitalizeWords } from "@/utils/capitalizeWords";
import SendMessage from "./send-message";
import SkeletonLoader from "../common/skeleton-loader";
import { Message } from "@/types/chat";

const ChatConversation = ({ id }: { id?: string }) => {
    const { data: user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { data, isLoading } = useGetMessages(id as string, page);
    const scrollRef = useRef<HTMLDivElement>(null);

    // ✅ Load messages with pagination
    useEffect(() => {
        if (data?.messages?.length) {
            setMessages((prev) => {
                const existingIds = new Set(prev.map((m) => m._id));
                const newMsgs = data.messages.filter((m: Message) => !existingIds.has(m._id));
                return [...newMsgs.reverse(), ...prev];
            });
            setHasMore(data.messages.length >= data.limit);
        }
    }, [data]);

    useEffect(() => {
        if (!isLoading && messages.length > 0 && scrollRef.current) {
            const container = scrollRef.current;
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
        }
    }, [messages, isLoading]);


    // ✅ Infinite scroll
    const handleScroll = useCallback(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || isLoading || !hasMore) return;
        if (scrollContainer.scrollTop < 80) setPage((p) => p + 1);
    }, [isLoading, hasMore]);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;
        scrollContainer.addEventListener("scroll", handleScroll);
        return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // ✅ Local message
    const handleLocalMessage = (newMessage: Message) => {
        setMessages((prev) => [...prev, newMessage]);
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }, 100);
    };

    return (
        <div className="flex flex-col h-full w-full bg-white border shadow">
            {/* ---------------- HEADER ---------------- */}
            <div className="flex items-center gap-3 p-4 border-b">
                {isLoading ? (
                    // 🔹 Header Skeleton Loader
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

                {/* Actual messages */}
                {messages.map((msg) => {
                    const isSent = msg.sender?._id === user?._id;
                    const sender = msg.sender || {};
                    const hasImage = sender.profilePicture;
                    const avatarUrl = hasImage
                        ? "https://ajar-server.hostdonor.com" + sender.profilePicture
                        : "";

                    return (
                        <div
                            key={msg._id || Math.random()}
                            className={`flex ${isSent ? "justify-end" : "justify-start"} mb-5`}
                        >
                            <div
                                className={`flex flex-col relative ${isSent ? "items-end text-right" : "items-start text-left"
                                    }`}
                            >
                                {/* Avatar at top corner */}
                                <div
                                    className={`absolute ${isSent ? "right-0" : "left-0"} top-9`}
                                >
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

                                {/* Name under image */}
                                <div
                                    className={`mt-9 text-xs font-medium text-gray-500 ${isSent ? "pr-10" : "pl-10"
                                        }`}
                                >
                                    {isSent ? "You" : capitalizeWords(sender.name)}
                                </div>

                                {/* Message bubble under name */}
                                <div
                                    className={`mt-1 px-3 py-2 rounded-lg text-sm max-w-xs ${isSent
                                        ? "bg-aqua text-white rounded-br-none mr-10"
                                        : "bg-gray-100 text-gray-800 rounded-bl-none ml-10"
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                    <span
                                        className={`block text-[10px] mt-1 ${isSent ? "text-white" : "text-gray-400"
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
            <SendMessage
                chatId={id as string}
                receiverId={data?.receiver?._id as string}
                onLocalMessage={handleLocalMessage}
            />
        </div>
    );
};

export default ChatConversation;
