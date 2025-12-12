"use client"

import React from 'react'
import Link from 'next/link'
import { XCircle } from 'lucide-react'

const CancelPage = () => {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-12 text-center">

                {/* Error Icon */}
                <div className="mb-4 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-60"></div>
                        <XCircle className="relative w-16 h-16 text-red-600" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Payment Canceled
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-10 text-vase leading-relaxed">
                    Your payment was not completed. You can try again or return to browse more listings.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center w-full px-8 py-3 text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    )
}

export default CancelPage