"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import api from "@/lib/axios"

const PaymentProcessing = () => {
    const router = useRouter();
    const { id } = useParams();
    const paymentIntentId = id as string;

    const [status, setStatus] = useState<"pending" | "succeeded" | "failed">(
        "pending"
    )
    const [message, setMessage] = useState("Confirming your payment...")

    useEffect(() => {
        if (!paymentIntentId) return

        const verifyPayment = async () => {
            try {

                const res = await api.post("/api/payments/stripe/verify", {
                    paymentIntentId,
                })
                const data = res.data

                if (data.verified === true) {
                    setStatus("succeeded")
                    router.replace("/success")
                } else if (data.verified === false) {
                    setStatus("failed")
                    router.replace("/failed")
                } else {
                    setStatus("pending")
                    setMessage(
                        "Payment is still being confirmed. Please wait a moment..."
                    )
                    setTimeout(verifyPayment, 3000)
                }
            } catch (err) {
                console.error(err)
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
