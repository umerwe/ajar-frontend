"use client"

import React from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

const SuccessPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl py-12 px-7 text-center">
                
                {/* Success Icon */}
                <div className="mb-4 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-teal-100 rounded-full blur-xl opacity-60"></div>
                        <CheckCircle className="relative w-16 h-16 text-aqua" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Booking Confirmed!
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-10 text-base leading-relaxed">
                    Your booking has been successfully confirmed. You can view your booking details below.
                </p>

                {/* CTA Button */}
                <Link
                    href="/booking/completed"
                    className="inline-flex items-center justify-center w-full py-3 text-white bg-header rounded-full hover:bg-aqua transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    View Booking
                </Link>
            </div>
        </div>
    )
}

export default SuccessPage