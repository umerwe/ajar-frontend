import { useMutation } from "@tanstack/react-query";
import { verifyUserByEmail, resendVerificationByEmail } from "@/services/verification";
import { toast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export const useVerificationByEmail = () => {
    const t = useTranslations("translation");
    const mutation = useMutation({
        mutationFn: verifyUserByEmail,
        onError: (error) => {
            toast({
                title: t("emailVerificationFailed"),
                description: getApiErrorMessage(error, t("pleaseTryAgain")),
                variant: "destructive",
            });
        },
    });

    return mutation;
};

export const useResendVerificationByEmail = () => {
    const t = useTranslations("translation");
    const mutation = useMutation({
        mutationFn: resendVerificationByEmail,
        onSuccess: () => {
            toast({
                title: t("otpResentSuccessfully"),
                variant: "default",
            });
        },
        onError: (error) => {
            toast({
                title: t("otpResendFailed"),
                description: getApiErrorMessage(error, t("pleaseTryAgain")),
                variant: "destructive",
            });
        },
    });

    return mutation;
};
