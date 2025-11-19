"use client";

import { Send, Paperclip, Mic } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageForm, messageSchema } from "@/validations/chat";

type SendMessageProps = {
    onSend: (text: string) => void;
    isSending?: boolean;
};

const SendMessage = ({ onSend, isSending }: SendMessageProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<MessageForm>({
        resolver: zodResolver(messageSchema),
    });

    const onSubmit = (values: MessageForm) => {
        onSend(values.text);
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
                disabled={isSending}
                className="bg-aqua text-white p-2 rounded-lg disabled:opacity-60"
            >
                <Send className="w-5 h-5" />
            </button>
        </form>
    );
};

export default SendMessage;
