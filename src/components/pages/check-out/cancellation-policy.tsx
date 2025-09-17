"use client"
import React, { useState } from 'react'
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const CancellationPolicy = () => {
    const [isPolicyExpanded, setIsPolicyExpanded] = useState(true);
    const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false);
    return (
        <div className="max-w-2xl mt-10 space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl px-3.5 sm:px-6 py-4 shadow-sm">
                <button
                    type="button"
                    onClick={() => setIsPolicyExpanded(!isPolicyExpanded)}
                    className="flex items-center justify-between w-full text-left"
                >
                    <h3 className="text-md font-semibold text-gray-900">Cancellation policy</h3>
                    {isPolicyExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                </button>

                {isPolicyExpanded && (
                    <div className="mt-4 space-y-4">
                        <p className="text-green-600 font-medium">Fully refundable before Tue, Apr 29</p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Cancellations or changes made after 11:59pm (property local time) on Apr 29, 2025 or no-shows are subject to a
                            property fee equal to 100% of the total amount paid for the reservation.
                        </p>
                        <div className="bg-white rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
                                className="flex items-center justify-between w-full text-left"
                            >
                                <h3 className="text-md font-semibold text-gray-900">Special check-in instructions</h3>
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                            </button>

                            {isInstructionsExpanded && (
                                <div className="mt-4">
                                    <p className="text-gray-700 text-sm">Check-in instructions will be provided here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 px-2">
                <div className="flex-shrink-0">
                    <div className="w-4 h-4 bg-green-700 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                </div>
                <p className="text-gray-700 font-medium text-sm pb-0.5">
                    Fully refundable if plans change
                </p>
            </div>
        </div>
    )
}

export default CancellationPolicy
