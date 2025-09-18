import api from "@/lib/axios";

export async function getBooking(status?: string) {
  const endpoint = status ? `/api/bookings?status=${status}&page=2` : `/api/bookings`;
  const { data } = await api.get(endpoint);
  return data.data;
}

export async function getBookingId(id?: string) {
  const { data } = await api.get(`/api/bookings/${id}`);
  return data.data;
}

