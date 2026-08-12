"use client"

import { useForm } from "react-hook-form"
import { ForgotPassword, ForgotPasswordSchema } from "@/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../ui/auth-input"
import Button from "../auth/button"
import Header from "../auth/header"
import { useForgotPassword } from "@/hooks/useAuth"
import Footer from "../auth/footer"
import { useTranslations } from "next-intl"

const ForgotPasswordForm = () => {
    const t = useTranslations("translation")
    const { mutateAsync, isPending } = useForgotPassword();

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPassword>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    })

    const onSubmit = (formData: ForgotPassword) => {
        mutateAsync(formData.email)
        localStorage.setItem("email", formData.email)
    }
    return (
        <div className="bg-white rounded-md shadow-2xl px-4 py-8 sm:px-6 w-full lg:w-[333px]">
            <Header
                title={t("forgotPassword")}
                description={t("forgotPasswordDescription")}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                <Input
                    label={t("email")}
                    placeholder={t("enterYourEmail")}
                    type="email"
                    required
                    register={register("email")}
                    error={errors.email?.message}
                />

                <Button
                    isPending={isPending}
                    text={t("continue")}
                />

                <Footer
                    linkHref="/auth/login"
                    linkText={t("login")}
                    messageText={t("backToLogin")}
                    className="-mt-4"
                />
            </form>
        </div>
    )
}

export default ForgotPasswordForm
