import { toast } from "@/components/ui/toast";
import { getRefundPreview, sendRefundRequest, getRefundById } from "@/services/refund";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetRefundPreview(bookingId: string) {
    return useQuery({
        queryKey: ["refund-preview", bookingId],
        queryFn: () => getRefundPreview(bookingId),
        enabled: !!bookingId,
    });
}

export function useSendRefundRequest() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: sendRefundRequest,
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ["refund-preview"] });
            toast({
                title: "Success",
                description: "Your Refund Request has been successfully submitted.",
            });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Unable to submit refund request.";
            toast({
                title: "Submission Failed",
                description: message,
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