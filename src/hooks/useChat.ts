import { getChatList, getMessages, messageSeen, sendMessage } from "@/services/chat";
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

export function useGetMessages(id: string, page?: number) {
  return useQuery({
    queryKey: ["messages", id, page],
    queryFn: () => getMessages(id, page),
  });
}

export function useMessageSeen() {
  return useMutation({
    mutationFn: messageSeen,
  });
}

