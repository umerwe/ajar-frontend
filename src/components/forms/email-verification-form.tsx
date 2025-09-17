"use client"

import { useForm } from "react-hook-form"
import { Verification, VerificationSchema } from "@/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../fields/auth-input"
import Button from "../auth/button"
import Header from "../auth/header"

const EmailVerificationForm = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<Verification>({
        resolver: zodResolver(VerificationSchema),
        defaultValues: {
            email: ''
        }
    })

    const onSubmit = (formData: Verification) => {
        console.log("Submitted:", formData)
    }

    return (
        <div className="bg-white rounded-md shadow-2xl px-4 py-8 sm:py-10 sm:px-6 w-full lg:w-[330px]">
            <Header
                title="Email Verification"
                description="Enter Otp to get your account verified"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                    label="Enter OTP"
                    type="number"
                    placeholder="6435"
                    register={register("email")}
                    error={errors.email?.message}
                />

                <Button
                    text="Verify Account"
                />
            </form>
        </div>
    )
}

export default EmailVerificationForm
