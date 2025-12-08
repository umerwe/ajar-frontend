"use client"

import React from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

const SuccessPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl py-12 px-7 text-center">
                
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-teal-100 rounded-full blur-xl opacity-60"></div>
                        <CheckCircle className="relative w-20 h-20 text-aqua" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Booking Confirmed!
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                    Your booking has been successfully confirmed. You can view your booking details below.
                </p>

                {/* CTA Button */}
                <Link
                    href="/booking/completed"
                    className="inline-flex items-center justify-center w-full px-8 py-4 text-white bg-header rounded-full hover:bg-aqua transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    View Booking
                </Link>
            </div>
        </div>
    )
}

export default SuccessPage