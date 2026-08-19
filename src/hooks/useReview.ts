import { toast } from "@/components/ui/toast";
import { sendReview } from "@/services/review";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export function useSendReview() {
  const t = useTranslations("translation");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingId"] });
      queryClient.invalidateQueries({ queryKey: ["marketplaceListings"] });
      queryClient.invalidateQueries({ queryKey: ["marketplacelisting"] });

      toast({
        title: t("reviewSubmitted"),
        description: t("thankYouForFeedback"),
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: t("reviewSubmissionFailed"),
        description: getApiErrorMessage(error, t("reviewSubmissionError")),
        variant: "destructive",
      });
    },
  });
}
