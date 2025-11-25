"use client";

import Header from "@/components/pages/listing-details/header";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { useUser } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDisableTwoFactor, useEnableTwoFactor, useTwoFactorStart } from "@/hooks/useTwoFactor";

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
            router.push("/two-factor/verify");
        } else {
            await disableTwoFactor();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-3 sm:px-7">
                <Header title="Two-Factor Authentication" />
            </div>

            {/* 🔥 Loader below header */}
            {isLoading ? (
                <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                    <div className="bg-white mt-2 p-6 rounded-lg shadow-sm animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            ) : (
                <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                    <div className="bg-white mt-2 p-6">
                        <div className="space-y-4">
                            {/* Enable Option */}
                            <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200">
                                <Checkbox checked={is2FAVerified} disabled />
                                <label className="text-gray-900 font-medium">Enable</label>
                            </div>

                            {/* Disable Option */}
                            <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200">
                                <Checkbox checked={!is2FAVerified} disabled />
                                <label className="text-gray-900 font-medium">Disable</label>
                            </div>

                            {/* Continue Button */}
                            {is2FAVerified ? (
                                <div className="pt-4">
                                    <Button
                                        onClick={handleContinue}
                                        className="w-full"
                                        variant="destructive"
                                        disabled={isDisableTwoFactorPending}
                                    >
                                        {isDisableTwoFactorPending ? "Loading..." : "Disable 2FA"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="pt-4">
                                    <Button
                                        onClick={handleContinue}
                                        className="w-full"
                                        disabled={isEnableTwoFactorPending || isStartTwoFactorPending}
                                    >
                                        {isEnableTwoFactorPending || isStartTwoFactorPending
                                            ? "Loading..."
                                            : "Enable 2FA"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
