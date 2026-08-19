import { toast } from "@/components/ui/toast";
import { getRefundPreview, sendRefundRequest, getRefundById } from "@/services/refund";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export function useGetRefundPreview(bookingId: string) {
    return useQuery({
        queryKey: ["refund-preview", bookingId],
        queryFn: () => getRefundPreview(bookingId),
        enabled: !!bookingId,
    });
}

export function useSendRefundRequest() {
    const t = useTranslations("translation")
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: sendRefundRequest,
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ["refund-preview"] });
             queryClient.invalidateQueries({ queryKey: ["bookings"] });
            toast({
                title: t("success"),
                description: t("refundRequestSubmittedSuccessfully"),
            });
        },
        onError: (error) => {
            toast({
                title: t("submissionFailed"),
                description: getApiErrorMessage(error, t("unableToSubmitRefundRequest")),
                variant: "destructive",
            });
        },
    });
}

export function useGetRefundById(id: string) {
    return useQuery({
        queryKey: ["refund", id],
        queryFn: () => getRefundById(id),
        enabled: !!id,
    });
}
