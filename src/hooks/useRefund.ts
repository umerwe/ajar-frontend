import { toast } from "@/components/ui/toast";
import { sendRefundRequest } from "@/services/refund";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSendRefundRequest() {
    return useMutation({
        mutationFn: sendRefundRequest,
        onSuccess: () => {
            toast({
                title: "Your Refund Request has been successfully submitted.",
            });
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Refund Request Submission Failed",
                description: err.response?.data?.message || "Unable to submit refund request. Please try again.",
                variant: "destructive",
            });
        },
    });
}
