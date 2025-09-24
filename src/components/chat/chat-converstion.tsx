"use client";

import { Send, Paperclip, Mic } from "lucide-react";
import Image from "next/image";

const messages = [
    {
        id: 1,
        sender: "Grace Miller",
        avatar: "/img1.png",
        text: "Hi Jack! I'm doing well, thanks. Can’t wait for the weekend!",
        time: "10:30 AM",
        type: "received",
    },
    {
        id: 2,
        sender: "Jack Raymonds",
        avatar: "/img2.png",
        text: "I know, right? Weekend plans are the best. Any exciting plans on your end?",
        time: "10:30 AM",
        type: "sent",
    },
    {
        id: 3,
        sender: "Grace Miller",
        avatar: "/img3.png",
        text: "Absolutely! I'm thinking of going for a hike on Saturday. How about you?",
        time: "10:30 AM",
        type: "received",
    },
    {
        id: 4,
        sender: "Jack Raymonds",
        avatar: "/img4.png",
        text: "Hiking sounds amazing! I might catch up on some reading and also meet up with a few friends on Sunday.",
        time: "10:30 AM",
        type: "sent",
    },
    {
        id: 5,
        sender: "Grace Miller",
        avatar: "/img5.png",
        text: "That sounds like a great plan! Excited 😄",
        time: "10:30 AM",
        type: "received",
    },
    {
        id: 6,
        sender: "Jack Raymonds",
        avatar: "/img6.png",
        text: "Can’t wait for the weekend!",
        time: "10:30 AM",
        type: "sent",
    },
];

const ChatConversation = () => {
    return (
        <div className="flex flex-col h-full w-full bg-white border shadow">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b">
                <Image
                    src="/ai-logo.png"
                    alt="logo"
                    width={256}
                    height={256}
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <p className="font-semibold">Grace Miller</p>
                    <span className="text-xs text-green-500">Online</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-gray-600">⋮</button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${msg.type === "sent" ? "justify-end" : "justify-start"
                            }`}
                    >
                        {/* Avatar on left only for received */}
                        {msg.type === "received" && (
                            <Image
                            src={msg.avatar}
                            alt={msg.sender}
                            width={256}
                            height={256}
                            className="w-8 h-8 rounded-full"
                        />
                        )}

                        {/* Bubble */}
                        <div
                            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.type === "sent"
                                ? "bg-aqua text-white rounded-br-none"
                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                                }`}
                        >
                            <p>{msg.text}</p>
                            <span className={`block text-[10px] ${msg.type === "sent" ? "text-white" : "text-gray-400"}`}>
                                {msg.time}
                            </span>
                        </div>

                        {/* Avatar on right only for sent */}
                        {msg.type === "sent" && (
                            <Image
                                src={msg.avatar}
                                alt={msg.sender}
                                width={256}
                                height={256}
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 p-3 border-t">
                <input
                    type="text"
                    placeholder="Type message..."
                    className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-aqua"
                />
                <Paperclip className="text-gray-500 cursor-pointer" />
                <Mic className="text-gray-500 cursor-pointer" />
                <button className="bg-aqua text-white p-2 rounded-lg">
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatConversation;
