import api from "@/lib/axios";
import { BookingRequest } from "@/types/booking";

export async function getBooking(status?: string, currentPage?: number) {
  const endpoint = `/api/bookings?${status ? `status=${status}` : ""}${currentPage ? `&page=${currentPage}` : ""}`;

  const { data } = await api.get(endpoint);
  return data.data;
}

export async function getBookingId(id?: string) {
  const { data } = await api.get(`/api/bookings/${id}`);
  return data.data;
}

export async function createBooking({ booking }: { booking: BookingRequest }) {
  const { data } = await api.post(`/api/bookings`, booking);
  return data;
}

