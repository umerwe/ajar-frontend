import { toast } from "@/components/ui/toast";
import { extendRental, submitPin } from "@/services/booking";
import { createBooking, getBooking, getBookingId } from "@/services/booking";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast({ description: "Booking request submitted successfully." })
      router.replace(`/booking/pending`)
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
      toast({ description: "Booking extend successfully" })

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
