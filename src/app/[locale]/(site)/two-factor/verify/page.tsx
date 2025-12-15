"use client"
import EmailVerificationForm from "@/components/forms/email-verification-form";
import Header from "@/components/ui/header";
import { useEnableTwoFactor } from "@/hooks/useTwoFactor";
import { useEffect } from "react";

const Verification = () => {
    const { mutateAsync: enableTwoFactor } = useEnableTwoFactor();

    useEffect(() => {
        enableTwoFactor();
    }, []);
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-3 sm:px-7">
                <Header title="Two Factor Authentication" />
            </div>
            <div className="flex items-center justify-center min-h-[400px]">
                <EmailVerificationForm
                    title="Two Factor Authentication"
                    description="Enter OTP to get you account verified"
                    buttonText="Submit"
                />
            </div>
        </div>
    )
}

export default Verification
