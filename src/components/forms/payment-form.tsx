"use client"

import { useState } from "react"
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from "@stripe/react-stripe-js"
import { CreditCard, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { StripeCardFormProps } from "@/types/payment"
import { inputBaseClasses, stripeElementOptions } from "@/utils/stripe"

export const StripeCardForm = ({ clientSecret, bookingId, amount }: StripeCardFormProps) => {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)

    const [name, setName] = useState("")
    const [address, setAddress] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) return
        setIsLoading(true)

        const cardElement = elements.getElement(CardNumberElement)

        if (!cardElement) {
            setIsLoading(false)
            return
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: name,
                    address: {
                        line1: address,
                        country: 'PK',
                    },
                },
            },
        })

        if (error) {
            toast({
                description: error.message || "Payment failed.",
                variant: "destructive",
            })
            setIsLoading(false)
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            window.location.href = `/success?bookingId=${bookingId}`
        }
    }

    return (
        <form onSubmit={handleSubmit} className="py-2">

            <div className="max-h-[400px] overflow-y-auto px-1 space-y-6 mb-4">

                <div className="space-y-4">
                    <h3 className="font-semibold text-base">Payment method</h3>

                    {/* Card Number */}
                    <div className={inputBaseClasses}>
                        <CardNumberElement options={{ ...stripeElementOptions, showIcon: true }} className="w-full" />
                    </div>

                    {/* Expiry & CVC Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className={inputBaseClasses}>
                            <CardExpiryElement options={stripeElementOptions} />
                        </div>
                        <div className={`${inputBaseClasses} flex items-center gap-2`}>
                            <CardCvcElement options={stripeElementOptions} className="w-full" />
                            <CreditCard className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* --- Billing Address Section --- */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-base">Billing address</h3>

                    <input
                        required
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputBaseClasses}
                    />

                    <div className="relative">
                        <select
                            className={`${inputBaseClasses} appearance-none`}
                            defaultValue="PK"
                        >
                            <option value="PK">Pakistan</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    <input
                        required
                        placeholder="Address line 1"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={inputBaseClasses}
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading || !stripe || !elements}
                className="w-full py-6 text-lg transition-colors mt-2"
                variant="destructive"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                ) : (
                    `Pay $${Math.round(amount)}.00`
                )}
            </Button>

            <div className="flex justify-center items-center gap-2 text-xs text-muted-foreground mt-4">
                <Lock className="h-3 w-3" />
                <span>Payments are secure and encrypted</span>
            </div>
        </form>
    )
}