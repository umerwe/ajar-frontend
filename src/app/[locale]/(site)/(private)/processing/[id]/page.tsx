"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import api from "@/lib/axios"

const PaymentProcessing = () => {
    const router = useRouter();
    const { id } = useParams();
    const paymentIntentId = id as string;

    const [message, setMessage] = useState("Confirming your payment...")

    useEffect(() => {
        if (!paymentIntentId) return

        const verifyPayment = async () => {
            try {
                const res = await api.post("/api/payments/stripe/verify", {
                    paymentIntentId,
                })
                const data = res.data

                if (data.status === "succeeded") {
                    setMessage(data.message || "Payment successful!")
                    router.replace("/success")
                } else if (data.status === "failed") {
                    setMessage(data.message || "Payment failed")
                    router.replace("/failed")
                } else if (data.status === "pending") {
                    setMessage(
                        data.message || "Payment is still being confirmed. Please wait a moment..."
                    )
                }
            } catch (err) {
                setMessage(
                    "Error verifying payment. Please wait a moment or refresh the page."
                )
            }
        }

        verifyPayment()
    }, [paymentIntentId, router])

    return (
        <div className="min-h-[calc(100vh-66px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border py-12 px-7 text-center">
                <div className="mb-4 flex justify-center">
                    <Loader2 className="animate-spin w-12 h-12 text-aqua" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Processing Payment</h1>
                <p className="text-gray-600 text-base leading-relaxed">{message}</p>
            </div>
        </div>
    )
}

export default PaymentProcessing