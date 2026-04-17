import { toast } from "@/components/ui/toast";
import { sendReport, updateDamageReportStatus } from "@/services/report";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSendReport() {
    return useMutation({
        mutationFn: sendReport,
        onSuccess: () => {
            toast({
                title: "Your Report has been successfully submitted.",
            });
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Report Submission Failed",
                description: err.response?.data?.message || "Unable to submit report. Please try again.",
                variant: "destructive",
            });
        },
    });
}

export function useStatusDamageReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDamageReportStatus,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["booking"] });
            queryClient.invalidateQueries({ queryKey: ["bookingId", variables.bookingId] });
        },
        onError: (error) => {
            const err = error as AxiosError<{ message?: string }>;
            toast({
                title: "Approval Failed",
                description: err.response?.data?.message || "Unable to approve the report.",
                variant: "destructive",
            });
        },
    });
}
