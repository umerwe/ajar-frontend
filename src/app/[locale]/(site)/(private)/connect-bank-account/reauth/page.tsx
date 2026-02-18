"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function BankReauthPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.replace("/connect-bank-account");
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[calc(100vh-40px)] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center space-y-5">

                <div className="flex justify-center">
                    <div className="bg-amber-50 p-4 rounded-full">
                        <AlertCircle className="w-8 h-8 text-amber-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-900">Session Expired</h2>
                    <p className="text-sm text-gray-500">
                        Your Stripe onboarding session has expired. We'll redirect you to start a fresh connection.
                    </p>
                </div>

                {/* Countdown */}
                <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-700">{countdown}</span>
                    </div>
                    <p className="text-sm text-gray-400">Redirecting you back...</p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                        className="bg-amber-400 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                    />
                </div>

                <button
                    onClick={() => router.replace("/connect-bank-account")}
                    className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 transition"
                >
                    Redirect now
                </button>
            </div>
        </div>
    );
}