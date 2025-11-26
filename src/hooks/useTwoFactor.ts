import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { disableTwoFactor, enableTwoFactor, startTwoFactor, verifyTwoFactor } from "@/services/twoFactor";
import { toast } from "@/components/ui/toast";

export const useEnableTwoFactor = () => {
    const mutation = useMutation({
        mutationFn: enableTwoFactor,
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Two Factor Authentication Failed",
                description: err.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        },
    });
    return mutation;
};

export const useTwoFactorStart = () => {
    const mutation = useMutation({
        mutationFn: startTwoFactor,
        onSuccess: () => {
            toast({
                title: "Verification Code Sent to your Email",
                variant: "default",
            });
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Two Factor Authentication Failed",
                description: err.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        },
    });
    return mutation;
};

export const useTwoFactorVerify = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: verifyTwoFactor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Two Factor Authentication Failed",
                description: err.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        },
    });
    return mutation;
};

export const useDisableTwoFactor = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: disableTwoFactor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast({
                title: "Two Factor Authentication Disabled",
                variant: "default",
            });
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Two Factor Authentication Failed",
                description: err.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        },
    });
    return mutation;
};
