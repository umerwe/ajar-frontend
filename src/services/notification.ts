import api from "@/lib/axios";

export async function getNotification() {
  const { data } = await api.get(`/api/notifications`);
  return data.data;
}