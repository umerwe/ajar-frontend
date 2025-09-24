import api from "@/lib/axios";

export async function getChatList() {
    const { data } = await api.get("/api/chats");
    return data.data;
  }