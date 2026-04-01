"use client";

import { useState } from "react";
import {
    AlertCircle,
    ChevronDown,
    MessageSquare,
    FileText,
    Receipt,
    MinusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { useBooking } from "@/hooks/useBooking";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { useSendRefundRequest, useGetRefundPreview } from "@/hooks/useRefund";
import { Listing } from "@/types/listing";
import { useSearchParams } from "next/navigation";

export default function RefundRequestForm() {
    const searchParams = useSearchParams();
    const bookingIdFromUrl = searchParams.get('bookingId');

    const { data } = useBooking("booking_cancelled", 1, "true");
    const { mutate, isPending } = useSendRefundRequest();

    const [booking, setBooking] = useState(bookingIdFromUrl || "");
    const [refundReason, setRefundReason] = useState("");
    const [note, setNote] = useState("");

    // Fetch Preview Data based on selected booking
    const { data: previewData, isLoading: isPreviewLoading } = useGetRefundPreview(booking);
    const preview = previewData?.data;

    const bookings = data?.data?.bookings;

    const handleSubmit = () => {
        const payload = {
            booking: booking,
            reason: refundReason,
            note: note,
        };

        mutate(payload as any, {
            onSuccess: () => {
                resetForm();
            }
        });
    };

    const resetForm = () => {
        setBooking("");
        setRefundReason("");
        setNote("");
    };

    const inputClass = "w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all placeholder:text-gray-400";
    const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none";

    return (
        <div className="min-h-screen bg-white">
            <Header title="Refund Request" />

            <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
                <div className="mb-8">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Submit Refund</h1>
                    <p className="text-sm text-gray-400 mt-1">Please fill in the details below to submit your refund request.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8 space-y-6">
                            {/* Booking Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Booking</label>
                                <div className="relative">
                                    <span className={`${iconClass} text-slate-400`}>
                                        <FileText size={18} />
                                    </span>
                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <ChevronDown size={18} />
                                    </span>
                                    <select
                                        className={`${inputClass} appearance-none cursor-pointer`}
                                        value={booking}
                                        onChange={(e) => setBooking(e.target.value)}
                                    >
                                        <option value="">
                                            {bookings?.length ? "Select a booking" : "No bookings available"}
                                        </option>
                                        {bookings?.map((b: { _id: string; marketplaceListingId: Listing }) => (
                                            <option key={b?._id} value={b?._id}>
                                                {typeof b?.marketplaceListingId === "object"
                                                    ? capitalizeWords(b?.marketplaceListingId?.name)
                                                    : "Booking " + b?._id.slice(-4)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Refund Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for Refund <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <span className={`${iconClass} text-aqua`}>
                                        <AlertCircle size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="e.g. Item not as described..."
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Note</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-4 text-aqua pointer-events-none">
                                        <MessageSquare size={18} />
                                    </span>
                                    <textarea
                                        placeholder="Any additional details..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        rows={4}
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary / Preview Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Receipt size={20} className="text-aqua" />
                                Refund Summary
                            </h2>

                            {!booking ? (
                                <p className="text-sm text-gray-400 text-center py-8">Select a booking to see refund breakdown.</p>
                            ) : isPreviewLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Paid Amount</span>
                                        <span className="font-medium text-gray-700">${preview?.totalBookingAmount?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Deduction Fee</span>
                                        <span className="font-medium text-red-500">-${preview?.deductionFee?.toFixed(2)}</span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-800">Estimated Refund</span>
                                            <span className="text-xl font-bold text-aqua">${preview?.estimatedRefund?.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {!preview?.isEligible && (
                                        <div className="bg-red-50 p-3 rounded-xl flex gap-2 mt-4">
                                            <MinusCircle size={16} className="text-red-500 shrink-0" />
                                            <p className="text-[11px] text-red-600">This booking is outside the refund window. No funds will be returned.</p>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isPending || !booking || !refundReason}
                                        variant="destructive"
                                        className="w-full mt-4 py-6 rounded-2xl shadow-lg shadow-red-100"
                                    >
                                        {isPending ? "Submitting..." : "Confirm & Submit"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}