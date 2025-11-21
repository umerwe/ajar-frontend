"use client";

import { Send, Paperclip, Mic } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageForm, messageSchema } from "@/validations/chat";
import { useState } from "react";
import api from "@/lib/axios";

type SendMessageProps = {
  onSend: (text: string) => void;
  isSending?: boolean;
  chatId?: string;
  receiverId?: string;
};

const SendMessage = ({ onSend, isSending, chatId, receiverId }: SendMessageProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
  });

  // 📨 SEND MESSAGE
  const onSubmit = (values: MessageForm) => {
    if (fileUrl) {
      onSend(fileUrl); // Send uploaded file URL instead of text
      setFileUrl(null); // Reset file
    } else {
      onSend(values.text);
    }
    reset();
    setValue("text", ""); // Clear input
  };

  // 📎 FILE UPLOAD
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatId || !receiverId) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("chatId", chatId);
      formData.append("receiver", receiverId);
      formData.append("attachments", file);
      formData.append("text", "joker");

      const response = await api.post(`/api/chats/send-message`, formData);

      // 👇 Get uploaded file URL from API response
      const url = response?.data?.data?.attachments?.[0];
      console.log(response?.data)
      if (url) {
        setFileUrl(url);
        setValue("text", file.name);
      }

      console.log("📢 FILE API Response:", response.data);
    } catch (error) {
      console.error("❌ File Upload Error:", error);
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-2 p-3 border-t relative"
    >
      <div className="flex-1 relative">
        {fileUrl ? (
          // 🖼 IMAGE PREVIEW
          <div className="flex items-center gap-2 border rounded-lg p-2 bg-gray-50">
            <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${fileUrl}`} alt="attachment" className="w-10 h-10 rounded-md object-cover" />
          </div>
        ) : (
          <input
            type="text"
            placeholder="Type message..."
            {...register("text")}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-aqua"
          />
        )}

        {errors.text && !fileUrl && (
          <p className="text-red-500 text-xs absolute -top-5 left-3">
            {errors.text.message}
          </p>
        )}
      </div>

      {/* HIDDEN FILE INPUT */}
      <input type="file" className="hidden" id="fileUpload" onChange={handleFileUpload} />

      <label htmlFor="fileUpload" className="cursor-pointer">
        <Paperclip className="text-gray-500" />
      </label>

      <Mic className="text-gray-500 cursor-pointer" />

      <button
        type="submit"
        disabled={isSending || isUploading}
        className="bg-aqua text-white p-2 rounded-lg disabled:opacity-60"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SendMessage;
