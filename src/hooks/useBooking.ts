import { getBooking, getBookingId } from "@/services/useBooking";
import { useQuery } from "@tanstack/react-query";

export function useBooking(status?: string) {
  return useQuery({
    queryKey: ["bookings", status],
    queryFn: () => getBooking(status),
  });
}

export function useGetBookingId(id?: string) {
  return useQuery({
    queryKey: ["bookingId", id],
    queryFn: () => getBookingId(id),
  });
}
