"use client";

import Header from "@/components/pages/listing-details/header";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useGetChatList } from "@/hooks/useChat";
import Image from "next/image";

const users = [
    {
        id: 1,
        name: "Ava Johnson",
        message: "See you at the cafe later ☕",
        time: "09:15 AM",
        avatar: "/img1.png",
        unread: 1,
    },
    {
        id: 2,
        name: "Ethan Parker",
        message: "Typing...",
        time: "11:45 AM",
        avatar: "/img2.png",
        typing: true,
    },
    {
        id: 3,
        name: "Sophia Martinez",
        message: "Can’t wait for the trip!",
        time: "Yesterday",
        avatar: "/appartments-img1.webp",
        active: true,
    },
    {
        id: 4,
        name: "Liam Carter",
        message: "Did you finish the project?",
        time: "08:22 PM",
        avatar: "/appartments-img2.webp",
    },
    {
        id: 5,
        name: "Isabella Brown",
        message: "Call me when you’re free 📞",
        time: "07:05 PM",
        avatar: "/img5.png",
        unread: 3,
    },
    {
        id: 6,
        name: "Noah Wilson",
        message: "Let’s meet at the gym 🏋️",
        time: "Monday",
        avatar: "/img6.png",
    },
    {
        id: 7,
        name: "Mia Thompson",
        message: "Thanks for the recommendation ❤️",
        time: "Sunday",
        avatar: "/img7.png",
    }
];

const ChatList = () => {
    const { data } = useGetChatList();
    console.log(data)
    return (
        <div className="bg-white shadow-lg overflow-hidden border border-gray-200 px-2">
            {/* Header */}
            <Header
                title="Chat"
            />

            {/* Search */}
            <div className="p-3 border-b border-gray-200 flex items-center gap-3">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
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

            {/* Users */}
            <div className="divide-y divide-gray-100">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${user.active ? "bg-blue-50" : ""
                            }`}
                    >
                        {/* Avatar */}
                        <Image
                            src={user.avatar}
                            alt={user.name}
                            width={256}
                            height={256}
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex justify-between items-start">
                            {/* Left side: Name + Message */}
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                    {user.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {user.typing ? (
                                        <span className="text-green-500">Typing...</span>
                                    ) : (
                                        user.message
                                    )}
                                </p>
                            </div>

                            {/* Right side: Time + Unread */}
                            <div className="flex flex-col items-end justify-between min-w-[50px]">
                                <span className="text-xs text-gray-500">{user.time}</span>
                                {user.unread && (
                                    <span className="mt-1 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-green-500 rounded-full">
                                        {user.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList;
