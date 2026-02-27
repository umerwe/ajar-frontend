import { toast } from "@/components/ui/toast";
import { sendReview } from "@/services/review";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSendReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingId"] });
      queryClient.invalidateQueries({ queryKey: ["marketplaceListings"] });
      queryClient.invalidateQueries({ queryKey: ["marketplacelisting"] });

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
        variant: "default",
      });
    },
    onError: (error) => {
      const err = error as AxiosError<ErrorResponse>;
      toast({
        title: "Review Submission Failed",
        description: err.response?.data?.message || "Something went wrong while submitting your review.",
        variant: "destructive",
      });
    },
  });
}
