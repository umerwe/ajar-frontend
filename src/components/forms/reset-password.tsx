"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { ResetPassword, ResetPasswordSchema } from "@/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../ui/auth-input"
import Button from "../auth/button"
import Header from "../auth/header"
import { useResetPassword } from "@/hooks/useAuth"
import Footer from "../auth/footer"
import CongratulationsDialog from "../dialogs/congratulations"
import { useTranslations } from "next-intl"

const ResetPasswordForm = () => {
    const t = useTranslations("translation")
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
            <CongratulationsDialog
                open={dialogOpen}
                title={t("passwordUpdated")}
                description={t("passwordChangedSuccessfully")}
                redirectTo="/auth/login"
            />

            <div className="bg-white rounded-md shadow-2xl px-4 py-8 sm:px-6 w-full lg:w-[330px]">
                <Header
                    title={t("resetPassword")}
                    description={t("setNewPassword")}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                    <Input
                        label={t("password")}
                        placeholder={t("enterYourPassword")}
                        type="password"
                        required
                        register={register("password")}
                        error={errors.password?.message}
                    />

                    <Button
                        isPending={isPending}
                        text={t("resetPassword")}
                    />

                    <Footer
                        linkHref="/auth/verification"
                        linkText={t("verifyAccount")}
                        messageText={t("backToVerification")}
                        className="-mt-4"
                    />
                </form>
            </div>
        </>
    )
}

export default ResetPasswordForm
