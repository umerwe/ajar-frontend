import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disableTwoFactor, enableTwoFactor, startTwoFactor, verifyTwoFactor } from "@/services/twoFactor";
import { toast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export const useEnableTwoFactor = () => {
    const t = useTranslations("translation");
    const mutation = useMutation({
        mutationFn: enableTwoFactor,
        onError: (error) => {
            toast({
                title: t("twoFactorAuthenticationFailed"),
                description: getApiErrorMessage(error, t("somethingWentWrong")),
                variant: "destructive",
            });
        },
    });
    return mutation;
};

export const useTwoFactorStart = () => {
    const t = useTranslations("translation");
    const mutation = useMutation({
        mutationFn: startTwoFactor,
        onSuccess: () => {
            toast({
                title: t("verificationCodeSentToEmail"),
                variant: "default",
            });
        },
        onError: (error) => {
            toast({
                title: t("twoFactorAuthenticationFailed"),
                description: getApiErrorMessage(error, t("somethingWentWrong")),
                variant: "destructive",
            });
        },
    });
    return mutation;
};

export const useTwoFactorVerify = () => {
    const t = useTranslations("translation");
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: verifyTwoFactor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error) => {
            toast({
                title: t("twoFactorAuthenticationFailed"),
                description: getApiErrorMessage(error, t("somethingWentWrong")),
                variant: "destructive",
            });
        },
    });
    return mutation;
};

export const useDisableTwoFactor = () => {
    const t = useTranslations("translation");
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: disableTwoFactor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast({
                title: t("twoFactorAuthenticationDisabled"),
                variant: "default",
            });
        },
        onError: (error) => {
            toast({
                title: t("twoFactorAuthenticationFailed"),
                description: getApiErrorMessage(error, t("somethingWentWrong")),
                variant: "destructive",
            });
        },
    });
    return mutation;
};
