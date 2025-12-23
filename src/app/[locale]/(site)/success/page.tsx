"use client"

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const SuccessContent = () => {
    const searchParams = useSearchParams()
    const bookingId = searchParams.get('bookingId')

    // Dynamic Text Logic
    const isBooking = Boolean(bookingId)

    const title = isBooking ? "Booking Confirmed!" : "Payment Successful!"
    const description = isBooking
        ? "Your booking has been successfully confirmed. You can view your booking details below."
        : "Your wallet has been successfully topped up. You can check your new balance in your wallet."
    const buttonText = isBooking ? "View Booking" : "Go to Wallet"
    const buttonHref = isBooking ? "/booking/completed" : "/wallet"

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border py-12 px-7 text-center">

                {/* Success Icon */}
                <div className="mb-4 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-teal-100 rounded-full blur-xl opacity-60"></div>
                        <CheckCircle className="relative w-16 h-16 text-aqua" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {title}
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-10 text-base leading-relaxed">
                    {description}
                </p>

                {/* CTA Button */}
                <Link
                    href={buttonHref}
                    className="inline-flex items-center justify-center w-full py-3 text-white bg-header rounded-full hover:bg-aqua transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {buttonText}
                </Link>
            </div>
        </div>
    )
}

const SuccessPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}

export default SuccessPage