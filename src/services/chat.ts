import api from "@/lib/axios";
import { MessagePayload } from "@/types/chat";

export async function getChatList() {
  const { data } = await api.get("/api/chats");
  return data.data;
}

export async function sendMessage(payload: MessagePayload) {
  const { data } = await api.post("/api/chats/send-message", payload);
  return data.data;
}

export async function getMessages(id: string, page?: number) {
  const { data } = await api.get(`/api/chats/${id}/messages?page=${page}`);
  return data.data;
}

export async function messageSeen(chatId : string) {
  const { data } = await api.patch(`/api/messages/${chatId}/seen`);
  return data.data;
}