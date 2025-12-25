import { toast } from "@/components/ui/toast";
import { extendRental, submitPin, updateBookingStatus } from "@/services/booking";
import { createBooking, getBooking, getBookingId } from "@/services/booking";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export function useBooking(status?: string, currentPage?: number) {
  return useQuery({
    queryKey: ["bookings", status, currentPage],
    queryFn: () => getBooking(status, currentPage),
  });
}

export function useGetBookingId(id?: string) {
  return useQuery({
    queryKey: ["bookingId", id],
    queryFn: () => getBookingId(id),
  });
}

export function useCreateBooking() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });

      toast({ description: "Booking request submitted successfully." })
      router.replace(`/booking/pending`);

    },
    onError: (error) => {
      const err = error as AxiosError<ErrorResponse>;
      toast({
        title: "Booking Failed",
        description: err.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateBookingStatus() {
  const router = useRouter();
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
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
  return useMutation({
    mutationFn: submitPin,
    onSuccess: () => {
      toast({ description: "PIN submitted successfully" })

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
  return useMutation({
    mutationFn: extendRental,
    onSuccess: () => {
      toast({ description: "Extension request created successfully" })

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
