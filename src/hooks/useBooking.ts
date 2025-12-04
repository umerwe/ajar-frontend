import { toast } from "@/components/ui/toast";
import { createBooking, getBooking, getBookingId } from "@/services/useBooking";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useBooking(status?: string,currentPage?: number) {
  return useQuery({
    queryKey: ["bookings", status,currentPage],
    queryFn: () => getBooking(status,currentPage),
  });
}

export function useGetBookingId(id?: string) {
  return useQuery({
    queryKey: ["bookingId", id],
    queryFn: () => getBookingId(id),
  });
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: createBooking,
    onError: (error) => {
      const err = error as AxiosError<ErrorResponse>;
      toast({
        title: "Booking Failed",
        description: err.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
}
