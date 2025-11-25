"use client"

import { useForm } from "react-hook-form"
import { ForgotPassword, ForgotPasswordSchema } from "@/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../fields/auth-input"
import Button from "../auth/button"
import Header from "../auth/header"
import { useForgotPassword } from "@/hooks/useAuth"
import Footer from "../auth/footer"

const ForgotPasswordForm = () => {
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
        <div className="bg-white rounded-md shadow-2xl px-4 py-8 sm:px-6 w-full lg:w-[330px]">
            <Header
                title="Forgot Password"
                description="Enter your email to forgot your password"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                <Input
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                    required
                    register={register("email")}
                    error={errors.email?.message}
                />

                <Button
                    isPending={isPending}
                    text="Verify Account"
                />

                <Footer
                    linkHref="/auth/login"
                    linkText="Login"
                    messageText="Back to login?"
                    className="-mt-4"
                />
            </form>
        </div>
    )
}

export default ForgotPasswordForm
