import { getChatList, getMessages, sendMessage } from "@/services/chat";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetChatList() {
  return useQuery({
    queryKey: ["chatList"],
    queryFn: () => getChatList(),
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: sendMessage,
  });
}

export function useGetMessages(id: string, page: number) {
  return useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessages(id, page),
  });
}
