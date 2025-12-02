"use client";

import Header from "@/components/pages/listing-details/header";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useGetChatList, useMessageSeen } from "@/hooks/useChat";
import Image from "next/image";
import { useUser } from "@/hooks/useAuth";
import { capitalizeWords } from "@/utils/capitalizeWords";
import Link from "next/link";
import SkeletonLoader from "../common/skeleton-loader";
import clsx from "clsx";
import { Chat, Participant } from "@/types/chat";
import { useEffect } from "react";

const ChatList = ({ id }: { id?: string }) => {
    const { data: user, isLoading } = useUser();
    const { mutate } = useMessageSeen();


    const { data, isLoading: chatLoading, refetch } = useGetChatList();

    const chats = data?.chats?.map((chat: Chat) => ({
        ...chat,
        unreadCount: chat._id === id ? 0 : chat.unreadCount,
        participants: chat.participants.filter((p: Participant) => p?._id !== user?._id),
    }));


    useEffect(() => {
        try {
            mutate(id as string);
            refetch()
        }
        catch {
            console.log("Error")
        }

    }, [id]);

    return (
        <div className="bg-white shadow-lg overflow-hidden border border-gray-200 px-2">
            {/* Header */}
            <Header title="Chat" />

            {/* Search */}
            <div className="p-3 border-b border-gray-200 flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search messages, people"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                <Button
                    variant="destructive"
                    className="w-9 h-9 rounded-lg text-xl leading-none"
                >
                    +
                </Button>
            </div>

            {/* Chats List */}
            <div className="divide-y divide-gray-100">
                {chatLoading || isLoading ? (
                    <SkeletonLoader variant="chat" count={8} />
                ) : chats?.length > 0 ? (
                    chats.map((chat: Chat) => {
                        const participant = chat?.participants[0];
                        const isSelected = chat._id === id;

                        return (
                            <Link
                                href={`/chat?id=${chat._id}`}
                                key={chat._id}
                                className={clsx(
                                    "flex items-center gap-3 p-3 cursor-pointer transition-all duration-150",
                                    isSelected
                                        ? "bg-aqua/20 border-l-4 border-aqua text-white"
                                        : "hover:bg-gray-50"
                                )}
                            >
                                {/* Avatar */}
                                {participant?.profilePicture ? (
                                    <Image
                                        src={process.env.NEXT_PUBLIC_API_BASE_URL + participant?.profilePicture}
                                        alt={participant.name}
                                        width={256}
                                        height={256}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className={clsx(
                                            "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg",
                                            "bg-aqua"
                                        )}
                                    >
                                        {participant?.name.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {/* Details */}
                                <div className="flex-1 min-w-0 flex justify-between items-start">
                                    <div className="min-w-0">
                                        <p
                                            className={clsx(
                                                "text-sm font-semibold truncate",
                                                "text-gray-800"
                                            )}
                                        >
                                            {capitalizeWords(participant?.name)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end justify-between min-w-[50px]">
                                        <span className="text-xs text-gray-500">
                                            {new Date(chat?.updatedAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </span>
                                        {chat?.unreadCount as number > 0 && (
                                            <span className="mt-1 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-green-500 rounded-full">
                                                {chat?.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="p-5 text-center text-gray-500 text-sm">
                        No chats found
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
