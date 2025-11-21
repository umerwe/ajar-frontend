import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { verifyUserByEmail, resendVerificationByEmail } from "@/services/verification";
import { toast } from "@/components/ui/toast";
import { AxiosError } from "axios";

export const useVerificationByEmail = () => {
    const mutation = useMutation({
        mutationFn: verifyUserByEmail,
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Email Verification Failed",
                description: err.response?.data?.message || "Please try again.",
                variant: "destructive",
            });
        },
    });

    return mutation;
};

export const useResendVerificationByEmail = () => {
    const mutation = useMutation({
        mutationFn: resendVerificationByEmail,
        onSuccess: () => {
            toast({
                title: "Otp Resend Successfully",
                variant: "default",
            });
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Otp Resend Failed",
                description: err.response?.data?.message || "Please try again.",
                variant: "destructive",
            });
        },
    });

    return mutation;
};