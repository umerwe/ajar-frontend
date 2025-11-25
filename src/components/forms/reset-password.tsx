"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { ResetPassword, ResetPasswordSchema } from "@/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../fields/auth-input"
import Button from "../auth/button"
import Header from "../auth/header"
import { useResetPassword } from "@/hooks/useAuth"
import Footer from "../auth/footer"
import CongratulationsDialog from "../auth/congratulations" // adjust import path as needed

const ResetPasswordForm = () => {
    const { mutateAsync, isPending } = useResetPassword()
    const [dialogOpen, setDialogOpen] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPassword>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: { password: '' }
    })

    const onSubmit = async (formData: ResetPassword) => {
        const email = localStorage.getItem("email");
        mutateAsync(
            { email: email!, ...formData },
            {
                onSuccess: () => setDialogOpen(true)
            }
        )
    }

    return (
        <>
            {/* Success Dialog */}
            <CongratulationsDialog
                open={dialogOpen}
                title="Password Updated!"
                description="Your password has been changed successfully."
            />

            {/* Form */}
            <div className="bg-white rounded-md shadow-2xl px-4 py-8 sm:px-6 w-full lg:w-[330px]">
                <Header
                    title="Reset Password"
                    description="Set your new password."
                />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        required
                        register={register("password")}
                        error={errors.password?.message}
                    />

                    <Button
                        isPending={isPending}
                        text="Reset Password"
                    />

                    <Footer
                        linkHref="/auth/verification"
                        linkText="Verify Account"
                        messageText="Back to verification?"
                        className="-mt-4"
                    />
                </form>
            </div>
        </>
    )
}

export default ResetPasswordForm
