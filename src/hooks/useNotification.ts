import { getNotification } from "../services/notification";
import { NotificationProps } from "@/types/notification";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUnreadNotificationCount, markAllNotificationsAsRead } from "@/services/notification";

export function useNotification({ page, limit }: NotificationProps) {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () => getNotification({ page, limit }),
  });
}

export function useGetUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}