"use client"

import React from "react";
import Image from "next/image";
import { CompleteProfile, CompleteProfileSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Input from "../fields/auth-input";
import Button from "../auth/button";
import Header from "../auth/header";

const CompleteProfileForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CompleteProfile>({
        resolver: zodResolver(CompleteProfileSchema),
        defaultValues: {
            name: "",
            dob: "",
            nationality: ""
        },
    });

    const onSubmit = (formData: CompleteProfile) => {
        console.log("Submitted: ", formData);
    };

    return (
        <div className="bg-white rounded-md shadow-2xl px-4 py-8 sm:py-6 sm:px-7 w-full lg:w-[105%]">
            <Header
                title="Complete your Profile"
                description="Enter the Following details to complete your profile"
            />

            {/* Profile Avatar */}
            <div className="flex justify-center mb-2">
                <div className="relative cursor-pointer">
                    <Image
                        src="/profile-frame.png"
                        width={100}
                        height={100}
                        alt="profile-frame"
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <Input
                    label="Name"
                    placeholder="Enter your name"
                    type="text"
                    register={register("name")}
                    error={errors.name?.message}
                />

                <Input
                    label="Date of Birth"
                    placeholder="MM/DD/YY"
                    type="date"
                    register={register("dob")}
                    error={errors.dob?.message}
                />

                <Input
                    label="Nationality"
                    placeholder="Pakistani"
                    type="text"
                    register={register("nationality")}
                    error={errors.nationality?.message}
                />

                <Button
                    text="Next"
                    className="mt-1.5"
                />
            </form>
        </div>
    );
};

export default CompleteProfileForm;
