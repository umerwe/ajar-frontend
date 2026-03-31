import api from "@/lib/axios";

export async function getRefundPreview(bookingId: string) {
  const response = await api.get(`/api/refunds/user/preview`, {
    params: { bookingId },
  });
  return response.data;
}

export async function sendRefundRequest(formData: any) {
  const response = await api.post(`/api/refunds/user`, formData);
  return response.data;
}

export async function getRefundById(id: string) {
  const response = await api.get(`/api/refunds/user/${id}`);
  return response.data;
}