"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useConfirmConnectedAccount } from "@/hooks/useWallet";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";

export default function BankSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { mutateAsync: confirmAccount } = useConfirmConnectedAccount();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const accountId = searchParams.get("accountId");
        const userId = searchParams.get("userId");

        if (!accountId || !userId) {
            setStatus("error");
            setMessage("Invalid callback. Missing account info.");
            return;
        }

        confirmAccount({ accountId, userId })
            .then(() => {
                setStatus("success");
                setMessage("Your bank account has been successfully connected!");
                setTimeout(() => router.replace("/connect-bank-account"), 3000);
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err?.response?.data?.error || "Failed to confirm account. Please try again.");
            });
    }, [searchParams]);

    return (
        <div className="min-h-[calc(100vh-40px)] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full text-center space-y-4">
                {status === "loading" && (
                    <>
                        <Loader />
                        <p className="text-gray-600">Verifying your bank account...</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <p className="text-4xl">✅</p>
                        <h2 className="text-xl font-semibold text-gray-900">Account Connected!</h2>
                        <p className="text-gray-500 text-sm">{message}</p>
                        <p className="text-gray-400 text-xs">Redirecting you back...</p>
                    </>
                )}
                {status === "error" && (
                    <>
                        <p className="text-4xl">❌</p>
                        <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
                        <p className="text-red-500 text-sm">{message}</p>
                        <Button
                            onClick={() => router.replace("/connect-bank-account")}
                            variant="destructive"
                        >
                            Go Back
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}