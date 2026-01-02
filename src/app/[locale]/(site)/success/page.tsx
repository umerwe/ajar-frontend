"use client"

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

const SuccessContent = () => {
    return (
        <div className="min-h-[calc(100vh-66px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border py-12 px-7 text-center">

                {/* Success Icon */}
                <div className="mb-4 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-teal-100 rounded-full blur-xl opacity-60"></div>
                        <CheckCircle className="relative w-16 h-16 text-aqua" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                    Payment Successful!
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-8 text-base leading-relaxed">
                    Your wallet has been successfully topped up. You can check your new balance in your wallet."
                </p>

                {/* CTA Button */}
                <Link
                    href={'/wallet'}
                    className="inline-flex items-center justify-center w-full py-3 text-white bg-header rounded-full hover:bg-aqua transition-all duration-200 font-medium text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Go to Wallet
                </Link>
            </div>
        </div>
    )
}

export default SuccessContent;