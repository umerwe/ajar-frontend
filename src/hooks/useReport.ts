import { toast } from "@/components/ui/toast";
import { sendReport } from "@/services/report";
import { useMutation } from "@tanstack/react-query";
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
