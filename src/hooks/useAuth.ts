import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getUser, loginUser, signUpUser, updateUser } from "@/services/auth";
import { toast } from "@/components/ui/toast";
import { AxiosError } from "axios";

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
            queryClient.invalidateQueries({ queryKey: ["user"] })
        },
    })
}

export const useSignup = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: signUpUser,
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Account created successfully! Redirecting to login..."
            });
            router.push("/auth/login");
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
        onSuccess: (token: string) => {
            localStorage.setItem("token", token);
            toast({
                title: "Welcome Back!",
                description: "You have successfully logged in.",
                variant: "default",
            });
            router.push("/");
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
