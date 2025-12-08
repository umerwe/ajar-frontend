import { toast } from "@/components/ui/toast";
import { createBooking, getBooking, getBookingId } from "@/services/useBooking";
import { useMutation, useQuery } from "@tanstack/react-query";
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
    onError: () => {
      toast({ description: "Failed to create booking.", variant: "destructive" })
    }
  });
}
