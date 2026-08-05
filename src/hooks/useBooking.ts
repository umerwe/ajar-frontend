import { toast } from "@/components/ui/toast";
import { extendRental, submitPin, updateBookingStatus } from "@/services/booking";
import { createBooking, getBooking, getBookingId } from "@/services/booking";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export function useBooking(status?: string, currentPage?: number, isRefundable?: string) {
  return useQuery({
    queryKey: ["bookings", status, currentPage, isRefundable],
    queryFn: () => getBooking(status, currentPage, isRefundable),
  });
}

export function useGetBookingId(id?: string) {
  return useQuery({
    queryKey: ["bookingId", id],
    queryFn: () => getBookingId(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listingBookedDates"],
      });

      toast({ description: "Booking request submitted successfully." })
      if (variables.redirectOnSuccess !== false) {
        router.replace(`/booking/pending`);
      }

    },
    onError: (error) => {
      const err = error as AxiosError<ErrorResponse>;
      toast({
        description: err.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateBookingStatus() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["bookingId"] })
      toast({ description: "Booking cancelled successfully." })
      router.replace(`/booking/all`);
    },
    onError: (error) => {
      const err = error as AxiosError<ErrorResponse>;
      toast({
        title: "Booking Status Update Failed",
        description: err.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });
}

export function useSubmitPin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitPin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      toast({ description: data?.message || "PIN submitted successfully" })
      router.push('/booking/in_progress')
    },
    onError: (error) => {
      const err = error as AxiosError<ErrorResponse>;
      toast({
        description: err.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });
}

export function useExtendRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: extendRental,
    onSuccess: () => {
      toast({ description: "Extension request created successfully" })
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["bookingId"] })
    },
    onError: (error) => {
      const err = error as AxiosError<ErrorResponse>;
      toast({
        description: err.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });
}
