import { getChatList } from "@/services/chat";
import { useQuery } from "@tanstack/react-query";

export function useGetChatList() {
  return useQuery({
    queryKey: ["chatList"],
    queryFn: () => getChatList(),
  });
}