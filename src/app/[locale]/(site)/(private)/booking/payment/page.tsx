"use client"

import { useEffect, useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CreditCard } from "lucide-react"
import Link from "next/link"
import Header from "@/components/ui/header"
import Loader from "@/components/common/loader"
import { StripeCardForm } from "@/components/forms/payment-form"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

type BookingPaymentSession = {
  clientSecret: string
  paymentIntentId: string
  amount: number
  successRedirect?: string
}

const isBookingPaymentSession = (value: unknown): value is BookingPaymentSession => {
  if (!value || typeof value !== "object") return false

  const session = value as Partial<BookingPaymentSession>
  return (
    typeof session.clientSecret === "string" &&
    typeof session.paymentIntentId === "string" &&
    typeof session.amount === "number" &&
    Number.isFinite(session.amount) &&
    (session.successRedirect === undefined || typeof session.successRedirect === "string")
  )
}

const BookingPaymentPage = () => {
  const [paymentSession, setPaymentSession] = useState<BookingPaymentSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedPayment = sessionStorage.getItem("bookingPayment")

    if (storedPayment) {
      try {
        const parsedPayment = JSON.parse(storedPayment)
        if (isBookingPaymentSession(parsedPayment)) {
          setPaymentSession(parsedPayment)
        }
      } catch {
        sessionStorage.removeItem("bookingPayment")
      }
    }

    setIsLoading(false)
  }, [])

  return (
    <div className="min-h-screen px-4 md:px-0">
      <Header title="Complete Booking Payment" />

      <div className="mx-auto mt-8 w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader />
          </div>
        ) : paymentSession ? (
          <>
            <div className="mb-5 flex items-start gap-3 border-b pb-4">
              <div className="rounded-lg bg-aqua p-2 text-white">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Secure card payment</h1>
                <p className="text-sm text-gray-500">
                  Pay ${paymentSession.amount.toFixed(2)} to submit your booking request.
                </p>
              </div>
            </div>

            <Elements stripe={stripePromise} options={{ clientSecret: paymentSession.clientSecret }}>
              <StripeCardForm
                clientSecret={paymentSession.clientSecret}
                amount={paymentSession.amount}
                paymentIntentId={paymentSession.paymentIntentId}
                successRedirect={paymentSession.successRedirect || "/booking/pending"}
              />
            </Elements>
          </>
        ) : (
          <div className="py-10 text-center">
            <h1 className="mb-2 text-xl font-semibold text-gray-900">Payment session expired</h1>
            <p className="mb-6 text-sm text-gray-500">
              Please create the booking again to continue payment.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-header px-6 py-3 text-sm font-medium text-white transition hover:bg-aqua"
            >
              Go to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingPaymentPage
