"use client";

import Header from "@/components/ui/header";
import { useUser } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDisableTwoFactor, useEnableTwoFactor, useTwoFactorStart } from "@/hooks/useTwoFactor";
import Loader from "@/components/common/loader";
import { ShieldCheck, ShieldOff } from "lucide-react";

export default function TwoFactorAuthPage() {
    const { data: user, isLoading } = useUser();
    const { mutateAsync: enableTwoFactor, isPending: isEnableTwoFactorPending } = useEnableTwoFactor();
    const { mutateAsync: startTwoFactor, isPending: isStartTwoFactorPending } = useTwoFactorStart();
    const { mutateAsync: disableTwoFactor, isPending: isDisableTwoFactorPending } = useDisableTwoFactor();
    const router = useRouter();

    const is2FAVerified = user?.twoFactor?.enabled ?? false;

    const handleContinue = async () => {
        if (!is2FAVerified) {
            await enableTwoFactor();
            await startTwoFactor();
            router.replace("/two-factor/verify");
        } else {
            await disableTwoFactor();
        }
    };

    return (
        <div className="min-h-screen">
            <div className="px-3 sm:px-7">
                <Header title="Two-Factor Authentication" />
            </div>

            {isLoading ? (
                <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-6 px-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm animate-pulse space-y-4">
                        <div className="h-24 bg-gray-100 rounded-xl" />
                        <div className="h-16 bg-gray-100 rounded-xl" />
                        <div className="h-10 bg-gray-100 rounded-xl" />
                    </div>
                </div>
            ) : (
                <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-6 px-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                        {/* Status Banner */}
                        <div className={`px-6 py-5 flex items-center gap-4 ${is2FAVerified ? "bg-aqua/10" : "bg-gray-50"}`}>
                            <div className={`p-3 rounded-full ${is2FAVerified ? "bg-header" : "bg-gray-200"}`}>
                                {is2FAVerified ? (
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                ) : (
                                    <ShieldOff className="w-6 h-6 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <p className={`font-semibold text-base ${is2FAVerified ? "text-gray-800" : "text-gray-700"}`}>
                                    {is2FAVerified ? "2FA is Enabled" : "2FA is Disabled"}
                                </p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {is2FAVerified
                                        ? "Your account is protected with two-factor authentication."
                                        : "Add an extra layer of security to your account."}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100" />

                        {/* Info + Action */}
                        <div className="px-6 py-5 space-y-4">
                            <div className={`rounded-xl p-4 text-sm ${is2FAVerified ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                                {is2FAVerified
                                    ? "⚠️ Disabling 2FA will make your account less secure. Anyone with your password can access your account."
                                    : "🔒 When enabled, you'll be asked for a verification code each time you log in."}
                            </div>

                            {is2FAVerified ? (
                                <Button
                                    onClick={handleContinue}
                                    className="w-full py-6 text-base rounded-xl"
                                    variant="destructive"
                                    disabled={isDisableTwoFactorPending}
                                >
                                    {isDisableTwoFactorPending ? "Disabling..." : "Disable 2FA"}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleContinue}
                                    className="w-full py-6 text-base rounded-xl"
                                    variant="destructive"
                                    disabled={isEnableTwoFactorPending || isStartTwoFactorPending}
                                >
                                    {isEnableTwoFactorPending || isStartTwoFactorPending
                                        ? <Loader />
                                        : "Enable 2FA"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}