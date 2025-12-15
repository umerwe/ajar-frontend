"use client";

import { Send, Paperclip, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageForm, messageSchema } from "@/validations/chat";
import { useState } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import { toast } from "../ui/toast";
import { SendMessageProps, FileItem } from "@/types/chat";

const SendMessage = ({ onSend, isSending, chatId, receiverId }: SendMessageProps) => {
  const [files, setFiles] = useState<FileItem[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
  });

  const textValue = watch("text");

  const onSubmit = (values: MessageForm) => {
    const fileUrls = files.map(f => f.url!).filter(Boolean);

    if (fileUrls.length > 0 || values.text) {
      onSend({
        text: values.text,
        fileUrls: fileUrls.length > 0 ? fileUrls : undefined
      });
    }
    setFiles([]);
    reset();
    setValue("text", "");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || !chatId || !receiverId) return;

    const newFiles: FileItem[] = Array.from(selectedFiles).map(file => ({
      url: null,
      name: file.name,
      isUploading: true,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    Array.from(selectedFiles).forEach(async (file) => {
      const formData = new FormData();
      formData.append("attachments", file);

      try {
        const response = await api.post(`/api/chats/upload-attachment`, formData);
        const url = response?.data?.attachments?.[0];

        setFiles(prev =>
          prev.map(f =>
            f.name === file.name
              ? { ...f, url: url || null, isUploading: false }
              : f
          )
        );
      } catch (error) {
        toast({
          title: "File Upload Failed",
          variant: "destructive",
        });
        setFiles(prev =>
          prev.map(f =>
            f.name === file.name
              ? { ...f, isUploading: false }
              : f
          )
        );
      }
    });

    e.target.value = "";
  };

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 p-3 border-t relative"
    >
      {files.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative w-16 h-16 flex-shrink-0">
              {file.isUploading ? (
                <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-md" />
              ) : (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${file.url}`}
                  alt={file.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}
              <button
                type="button"
                onClick={() => removeFile(file.name)}
                className="absolute -top-2 -right-2 bg-white z-10 rounded-full p-1 shadow hover:bg-gray-200 border"
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type message..."
            {...register("text")}
            className="w-full px-3 py-2 text-sm border rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            className="hidden"
            id="fileUpload"
            onChange={handleFileUpload}
            multiple
          />

          <label htmlFor="fileUpload" className="cursor-pointer">
            <Paperclip className="text-gray-500" />
          </label>

          <button
            type="submit"
            disabled={
              isSending ||
              files.some(f => f.isUploading) ||
              (!textValue?.trim() && files.length === 0)
            }
            className="bg-aqua text-white p-2 rounded-lg disabled:opacity-60 disabled:cursor-no-drop"
          >
            <Send className="w-5 h-5" />
          </button>

        </div>
      </div>
    </form>
  );
};

export default SendMessage;