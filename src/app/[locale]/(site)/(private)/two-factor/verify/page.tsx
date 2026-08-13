"use client"

import EmailVerificationForm from "@/components/forms/email-verification-form";
import Header from "@/components/ui/header";
import { useEnableTwoFactor } from "@/hooks/useTwoFactor";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

const Verification = () => {
    const t = useTranslations("translation");
    const { mutateAsync: enableTwoFactor } = useEnableTwoFactor();

    useEffect(() => {
        enableTwoFactor();
    }, []);
    return (
        <div className="min-h-screen">
            <div className="px-3 sm:px-7">
                <Header title={t("twoFactorAuthentication")} />
            </div>
            <div className="flex items-center justify-center min-h-[400px]">
                <EmailVerificationForm
                    title={t("twoFactorAuthentication")}
                    description={t("enterOtpToVerifyAccount")}
                    buttonText={t("submit")}
                />
            </div>
        </div>
    )
}

export default Verification
