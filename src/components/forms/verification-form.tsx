"use client"

import { useForm } from "react-hook-form"
import { Verification, VerificationSchema } from "@/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../fields/auth-input"
import Button from "../auth/button"
import Header from "../auth/header"

const VerificationForm = () => {
    

    const { register, handleSubmit, formState: { errors } } = useForm<Verification>({
        resolver: zodResolver(VerificationSchema),
        defaultValues: {
            email: ''
        }
    })

    // const handleClick = () => {
    //     // router.replace('/auth/verification/email')
    // }

    const onSubmit = (formData: Verification) => {
        console.log('submitted', formData)
    }
    return (
        <div className="bg-white rounded-md shadow-2xl px-4 py-8 sm:py-10 sm:px-6 w-full lg:w-[330px]">
            <Header
                title="Account Verification"
                description="Enter Email/Phone Number to verify your account"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Email or Phone Number"
                    placeholder="Enter your email"
                    type="email"
                    required
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

export default VerificationForm
