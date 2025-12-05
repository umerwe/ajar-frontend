"use client"

import { useForm } from "react-hook-form"
import { Verification, VerificationSchema } from "@/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../fields/auth-input"
import Button from "../auth/button"
import Header from "../auth/header"
import { useTwoFactorVerify } from "@/hooks/useTwoFactor"
import { toast } from "../ui/toast"
import { useRouter } from "next/navigation"

const TwoFactorVerificationForm = () => {
    const router = useRouter()
    const { mutateAsync: verifyTwoFactor, isPending: isVerifying } = useTwoFactorVerify();

    const { register, handleSubmit, formState: { errors } } = useForm<Verification>({
        resolver: zodResolver(VerificationSchema),
        defaultValues: { otp: '' }
    });

    // ✔ VERIFY OTP
    const onSubmit = (formData: Verification) => {
        const authToken = localStorage.getItem("2FAtoken");

        verifyTwoFactor({ token: formData.otp, authToken: authToken! },
            {
                onSuccess: (data) => {
                    localStorage.removeItem("2FAtoken")
                    localStorage.setItem("token", data.data.token)
                    toast({
                        title: "Login Successfully",
                        variant: "default",
                    })
                    router.replace("/")
                },
            }
        )
    };

    return (
        <>
            <div className={`bg-white rounded-md shadow-2xl px-4 py-8 sm:py-10 sm:px-6 w-full lg:w-[300px]`}>
                <Header title="2FA Verification" description="Enter OTP to verify your account" />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input
                        label="Enter OTP"
                        type="number"
                        placeholder="643512"
                        register={register("otp")}
                        error={errors.otp?.message}
                    />

                    <Button text="Verify Account" isPending={isVerifying} />
                </form>
            </div>
        </>
    );
};

export default TwoFactorVerificationForm;
