import api from "@/lib/axios";
import { BookingRequest } from "@/types/booking";

export async function getBooking(status?: string, currentPage?: number, isRefundable?: string) {
  const params = new URLSearchParams();

  params.append("role", "renter");
  params.append("limit", "8");

  if (status) params.append("status", status);
  if (currentPage) params.append("page", currentPage.toString());
  if (isRefundable) params.append("isRefundable", isRefundable);

  const endpoint = `/api/bookings/user/bookings?${params.toString()}`;

  const { data } = await api.get(endpoint);
  return data.data;
}


export async function getBookingId(id?: string) {
  const { data } = await api.get(`/api/bookings/user/booking/${id}`);
  return data.data;
}

export async function createBooking({ booking }: { booking: BookingRequest }) {
  const { data } = await api.post(`/api/bookings`, booking);
  return data;
}

export async function updateBookingStatus({ bookingId, status = "request_cancelled" }: { bookingId: string; status?: string }) {
  const { data } = await api.patch(`/api/bookings/${bookingId}/status`, {
    status
  });
  return data;
}

export async function submitPin({ bookingId, otp }: {
  bookingId: string;
  otp: string;
}) {
  const { data } = await api.post(`/api/bookings/${bookingId}/submit-pin`, { otp });
  return data;
}

export async function extendRental({ marketplaceListingId, extensionDate }: {
  marketplaceListingId: string;
  extensionDate: string;
}) {
  const { data } = await api.post(`/api/bookings`, {
    marketplaceListingId,
    extensionDate
  });
  return data;
}
