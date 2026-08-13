"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useConfirmConnectedAccount } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function BankSuccessPage() {
    const t = useTranslations("translation");
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
            setMessage(t("invalidCallbackMissingAccountInfo"));
            return;
        }

        confirmAccount({ accountId, userId })
            .then(() => {
                setStatus("success");
                setMessage(t("bankAccountSuccessfullyConnected"));
                setTimeout(() => router.replace("/connect-bank-account"), 3000);
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err?.response?.data?.error || t("failedToConfirmAccount"));
            });
    }, [searchParams]);

    return (
        <div className="min-h-[calc(100vh-40px)] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl border shadow-lg p-8 text-center">

                {status === "loading" && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
                            </div>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">{t("verifyingAccount")}</h1>
                        <p className="text-gray-500 text-sm">{t("confirmingBankWithStripe")}</p>
                    </>
                )}

                {status == "success" && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-green-100 rounded-full">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("accountConnected")}</h1>
                        <p className="text-gray-500 text-sm mb-6">{message}</p>
                        <div className="bg-gray-50 rounded-xl px-4 py-3">
                            <p className="text-xs text-gray-400">{t("redirectingBackInMoment")}</p>
                        </div>
                    </>
                )}

                {status == "error" && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-red-100 rounded-full">
                                <XCircle className="w-10 h-10 text-red-600" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("somethingWentWrong")}</h1>
                        <p className="text-gray-500 text-sm mb-6">{message}</p>
                        <Button
                            onClick={() => router.replace("/connect-bank-account")}
                            className="w-full rounded-xl py-6"
                            variant="destructive"
                        >
                            {t("goBack")}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
