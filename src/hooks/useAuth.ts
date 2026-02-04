import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { changePassword, forgotPassword, getUser, loginUser, resetPassword, signUpUser, updateUser } from "@/services/auth";
import { toast } from "@/components/ui/toast";
import { AxiosError } from "axios";
import { Register } from "@/validations/auth";
import { LoginSuccessResponse } from "@/types/auth";

export const useUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Update Failed",
                description: err.response?.data?.message || "Unable to update user. Please try again.",
                variant: "destructive",
            });
        },
    })
}

export const useSignup = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: signUpUser,
        onSuccess: (data: Register) => {
            toast({
                description: "Account created successfully! Please check your email for verification."
            });
            localStorage.setItem("email", data.email);
            router.push("/auth/verification");
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Registration Failed",
                description: err.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        },
    });
    return mutation;
};

export const useLogin = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data: LoginSuccessResponse) => {
            if (data?.user?.otp?.isVerified === false) {
                toast({
                    title: `4 Digit Code Sent to Email`,
                    variant: "default",
                })
                localStorage.setItem("email", data?.user?.email);
                router.push("/auth/verification");
            }
            else if (data?.require2FA) {
                toast({
                    title: `6 Digit Code Sent to Email`,
                    variant: "default",
                })
                localStorage.setItem("2FAtoken", data.tempToken!);
                router.push("/auth/verification/two-factor");
            }
            else {
                localStorage.setItem("token", data.token!);
                toast({
                    title: "Login Successfully"
                });
                router.push("/");
            }
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Login Failed",
                description: err.response?.data?.message || "Please try again.",
                variant: "destructive",
            });
        },
    });

    return mutation;
};

export const useForgotPassword = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: () => {
            toast({
                description: "A verification code has been sent to your email."
            });
            router.push("/auth/forgot-password/verification");
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Registration Failed",
                description: err.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        },
    });
    return mutation;
};

export const useResetPassword = () => {
    const mutation = useMutation({
        mutationFn: resetPassword,
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Registration Failed",
                description: err.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        },
    });
    return mutation;
};

export const useChangePassword = () => {
    const mutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            toast({
                title: "Password Changed Successfully"
            });
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Password Change Failed",
                description: err.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        },
    });
    return mutation;
};

