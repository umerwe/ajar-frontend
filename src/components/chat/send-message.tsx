"use client";

import { Send, Paperclip, Mic } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendMessage } from "@/hooks/useChat";
import { MessageForm, messageSchema } from "@/validations/chat";
import { useUser } from "@/hooks/useAuth";
import { Message, MessagePayload } from "@/types/chat";

type SendMessageProps = {
    chatId: string;
    receiverId: string;
    onLocalMessage: (message: Message) => void;
};

const SendMessage = ({ chatId, receiverId, onLocalMessage }: SendMessageProps) => {
    const { data: user } = useUser();
    const { mutate, isPending } = useSendMessage();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<MessageForm>({
        resolver: zodResolver(messageSchema),
    });

    const onSubmit = (values: MessageForm) => {
        if (!user) return; 

        const payload: MessagePayload = {
            chatId,
            receiver: receiverId,
            text: values.text,
        };

        const tempMessage : Message = {
            _id: Math.random().toString(36).substring(2),
            text: values.text,
            createdAt: new Date().toISOString(),
            sender: {
                _id: user._id,
                name: user.name || "You",
                profilePicture: user.profilePicture || null,
            },
        };

        onLocalMessage(tempMessage);

        mutate(payload);

        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center gap-2 p-3 border-t relative"
        >
            <input
                type="text"
                placeholder="Type message..."
                {...register("text")}
                className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-aqua"
            />
            {errors.text && (
                <p className="text-red-500 text-xs absolute -top-5 left-3">
                    {errors.text.message}
                </p>
            )}

            <Paperclip className="text-gray-500 cursor-pointer" />
            <Mic className="text-gray-500 cursor-pointer" />
            <button
                type="submit"
                disabled={isPending}
                className="bg-aqua text-white p-2 rounded-lg disabled:opacity-60"
            >
                <Send className="w-5 h-5" />
            </button>
        </form>
    );
};

export default SendMessage;
