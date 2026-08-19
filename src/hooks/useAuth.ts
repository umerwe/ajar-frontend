import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { changePassword, forgotPassword, getUser, loginUser, resetPassword, signUpUser, updateUser } from "@/services/auth";
import { toast } from "@/components/ui/toast";
import { Register } from "@/validations/auth";
import { LoginSuccessResponse } from "@/types/auth";
import { useTranslations } from "next-intl";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export const useUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    })
}

export const useUpdateUser = () => {
    const t = useTranslations("translation");
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error) => {
            toast({
                title: t("updateFailed"),
                description: getApiErrorMessage(error, t("unableToUpdateUser")),
                variant: "destructive",
            });
        },
    })
}

export const useSignup = () => {
    const t = useTranslations("translation");
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: signUpUser,
        onSuccess: (data: Register) => {
            toast({
                description: t("accountCreatedCheckEmail")
            });
            localStorage.setItem("email", data.email);
            router.push("/auth/verification");
        },
        onError: (error) => {
            toast({
                title: t("registrationFailed"),
                description: getApiErrorMessage(error, t("somethingWentWrong")),
                variant: "destructive",
            });
        },
    });
    return mutation;
};

export const useLogin = () => {
    const t = useTranslations("translation");
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data: LoginSuccessResponse) => {
            if (data?.user?.otp?.isVerified === false) {
                toast({
                    title: t("fourDigitCodeSentToEmail"),
                    variant: "default",
                })
                localStorage.setItem("email", data?.user?.email);
                router.push("/auth/verification");
            }
            else if (data?.require2FA) {
                toast({
                    title: t("sixDigitCodeSentToEmail"),
                    variant: "default",
                })
                localStorage.setItem("2FAtoken", data.tempToken!);
                router.push("/auth/verification/two-factor");
            }
            else {
                localStorage.setItem("token", data.token!);
                toast({
                    title: t("loginSuccessfully")
                });
                router.push("/");
            }
        },
        onError: (error) => {
            toast({
                title: t("loginFailed"),
                description: getApiErrorMessage(error, t("pleaseTryAgain")),
                variant: "destructive",
            });
        },
    });

    return mutation;
};

export const useForgotPassword = () => {
    const t = useTranslations("translation");
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: () => {
            toast({
                description: t("verificationCodeSentToEmail")
            });
            router.push("/auth/forgot-password/verification");
        },
        onError: (error) => {
            toast({
                title: t("registrationFailed"),
                description: getApiErrorMessage(error, t("somethingWentWrong")),
                variant: "destructive",
            });
        },
    });
    return mutation;
};

export const useResetPassword = () => {
    const t = useTranslations("translation");
    const mutation = useMutation({
        mutationFn: resetPassword,
        onError: (error) => {
            toast({
                title: t("registrationFailed"),
                description: getApiErrorMessage(error, t("somethingWentWrong")),
                variant: "destructive",
            });
        },
    });
    return mutation;
};

export const useChangePassword = () => {
    const t = useTranslations("translation");
    const mutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            toast({
                title: t("passwordChangedSuccessfully")
            });
        },
        onError: (error) => {
            toast({
                title: t("passwordChangeFailed"),
                description: getApiErrorMessage(error, t("somethingWentWrong")),
                variant: "destructive",
            });
        },
    });
    return mutation;
};

