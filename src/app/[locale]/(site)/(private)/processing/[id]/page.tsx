"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import api from "@/lib/axios"
import { useTranslations } from "next-intl"

const PaymentProcessing = () => {
    const t = useTranslations("translation");
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = useParams();
    const paymentIntentId = id as string;
    const redirectParam = searchParams.get("redirect");
    const successRedirect = redirectParam?.startsWith("/") && !redirectParam.startsWith("//")
        ? redirectParam
        : "/success";

    const [message, setMessage] = useState(t("confirmingPayment"))

    useEffect(() => {
        if (!paymentIntentId) return

        const verifyPayment = async () => {
            try {
                const res = await api.post("/api/payments/stripe/verify", {
                    paymentIntentId,
                })
                const data = res.data

                if (data.status === "succeeded" || data.stripeStatus === "requires_capture") {
                    setMessage(data.message || t("paymentSuccessful"))
                    router.replace(successRedirect)
                } else if (data.status === "failed") {
                    setMessage(data.message || t("paymentFailed"))
                    router.replace("/failed")
                } else if (data.status === "pending") {
                    setMessage(
                        data.message || t("paymentStillConfirming")
                    )
                }
            } catch (err) {
                setMessage(
                    t("errorVerifyingPayment")
                )
            }
        }

        verifyPayment()
    }, [paymentIntentId, router, successRedirect])

    return (
        <div className="min-h-[calc(100vh-66px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border py-12 px-7 text-center">
                <div className="mb-4 flex justify-center">
                    <Loader2 className="animate-spin w-12 h-12 text-aqua" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t("processingPayment")}</h1>
                <p className="text-gray-600 text-base leading-relaxed">{message}</p>
            </div>
        </div>
    )
}

export default PaymentProcessing
