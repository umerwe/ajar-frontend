"use client"

import { useForm } from "react-hook-form"
import { Verification, VerificationSchema } from "@/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../fields/auth-input"
import Button from "../auth/button"
import Header from "../auth/header"
import { useResendVerificationByEmail, useVerificationByEmail } from "@/hooks/useVerification"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import CongratulationsDialog from "../auth/congratulations" // adjust path if needed
import { toast } from "../ui/toast"

const EmailVerificationForm = ({ type }: { type?: string }) => {
    const router = useRouter();
    const { mutateAsync: verifyUserByEmail, isPending } = useVerificationByEmail();
    const { mutateAsync: resendVerificationByEmail, isPending: isResending } = useResendVerificationByEmail();

    const [timer, setTimer] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<Verification>({
        resolver: zodResolver(VerificationSchema),
        defaultValues: { otp: '' }
    });

    // ✔ VERIFY OTP
    const onSubmit = (formData: any) => {
        const email = 'glukik590@gmail.com';
        verifyUserByEmail(
            { ...formData, email },
            {
                onSuccess: () => {
                    if (type === "password") {
                        router.push("/auth/reset-password");
                        toast({
                            title: "Email Verified Successfully",
                            variant: "default",
                        });
                    } else {
                        setDialogOpen(true);
                    }
                },
            }
        );
    };

    // 🔁 RESEND OTP
    const handleResendOtp = async () => {
        await resendVerificationByEmail({ email: 'tubey3976@gmail.com' });
        setTimer(60);
        localStorage.setItem("otpTimer", (Date.now() + 60000).toString());
    };

    // ⏱ TIMER HANDLER
    useEffect(() => {
        const savedExpiry = localStorage.getItem("otpTimer");
        if (savedExpiry) {
            const remaining = Math.floor((Number(savedExpiry) - Date.now()) / 1000);
            if (remaining > 0) setTimer(remaining);
            else localStorage.removeItem("otpTimer");
        }

        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    localStorage.removeItem("otpTimer");
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    return (
        <>
            <CongratulationsDialog
                open={dialogOpen}
            />

            <div className="bg-white rounded-md shadow-2xl px-4 py-8 sm:py-10 sm:px-6 w-full lg:w-[330px]">
                <Header title="Email Verification" description="Enter OTP to get your account verified" />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input
                        label="Enter OTP"
                        type="number"
                        placeholder="6435"
                        register={register("otp")}
                        error={errors.otp?.message}
                    />

                    {/* RESEND SECTION */}
                    <p className="text-xs text-center text-gray-500">
                        Didn’t receive the code?{" "}
                        {timer > 0 ? (
                            <span className="text-gray-400">
                                Resend in <strong>{timer}s</strong>
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isResending}
                                className="text-aqua font-medium hover:underline disabled:opacity-60"
                            >
                                {isResending ? "Resending..." : "Resend"}
                            </button>
                        )}
                    </p>

                    <Button text="Verify Account" isPending={isPending} />
                </form>
            </div>
        </>
    );
};

export default EmailVerificationForm;
