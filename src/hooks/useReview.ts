import { toast } from "@/components/ui/toast";
import { sendReview } from "@/services/review";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSendReview() {
  return useMutation({
    mutationFn: sendReview,
    onSuccess: () => {
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
