import api from "@/lib/axios";
import { NotificationProps } from "@/types/notification";

export async function getNotification({ page, limit }: NotificationProps) {
  const { data } = await api.get(`/api/notifications?page=${page}&limit=${limit}`);
  return data;
}

export async function getUnreadNotificationCount() {
  const { data } = await api.get(`/api/notifications/unread-count`);
  return data;
}

export async function markAllNotificationsAsRead() {
  const { data } = await api.patch(`/api/notifications/mark-all-read`);
  return data;
}