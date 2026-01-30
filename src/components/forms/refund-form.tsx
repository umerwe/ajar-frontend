"use client";

import { useState } from "react";
import {
    AlertCircle,
    ChevronDown,
    Calendar,
    MessageSquare,
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { useBooking } from "@/hooks/useBooking";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { useSendRefundRequest } from "@/hooks/useRefund";
import { Listing } from "@/types/listing";

export default function RefundRequestForm() {
    const { data } = useBooking();
    const { mutate, isPending } = useSendRefundRequest();
    const bookings = data?.data?.bookings;

    const [booking, setBooking] = useState("");
    const [refundReason, setRefundReason] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [note, setNote] = useState("");

    const handleSubmit = () => {
        const utcDate = dateTime ? new Date(dateTime).toISOString() : null;

        const payload = {
            booking: booking,
            reason: refundReason,
            selectTime: utcDate,
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
        setDateTime("");
        setNote("");
    };

    return (
        <div className="min-h-screen bg-white">
            <Header title="Refund Request" />

            <div className="max-w-6xl mx-auto pt-6">
                <h1 className="text-lg md:text-xl font-semibold text-gray-800">Submit Refund</h1>
                <p className="text-xs md:text-sm text-gray-400">Please fill the following details to submit a refund request</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Booking Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Booking</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <FileText size={18} />
                            </span>
                            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                                <ChevronDown size={22} />
                            </span>
                            <select
                                className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-600 focus:outline-none appearance-none"
                                value={booking}
                                onChange={(e) => setBooking(e.target.value)}
                            >
                                <option value="">{bookings?.length ? "Select Booking" : "No Bookings Available"}</option>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Refund Reason</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                                <AlertCircle size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Enter the reason for refund"
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Date & Time Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date & Time</label>
                        <div 
                            className="relative group cursor-pointer"
                            onClick={(e) => {
                                // Trigger the native picker on the hidden input
                                const input = e.currentTarget.querySelector('input');
                                if (input) (input as any).showPicker?.();
                            }}
                        >
                            <div className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm flex items-center min-h-[38px]">
                                <span className="absolute left-3 text-slate-400 pointer-events-none">
                                    <Calendar size={18} />
                                </span>
                                
                                <span className={dateTime ? "text-gray-600" : "text-gray-400"}>
                                    {dateTime ? dateTime.replace('T', ' ') : "Select Date & Time"}
                                </span>

                                <span className="absolute right-5 text-slate-400 pointer-events-none">
                                    <ChevronDown size={18} />
                                </span>
                            </div>

                            <input
                                type="datetime-local"
                                value={dateTime}
                                onChange={(e) => setDateTime(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Note Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                                <MessageSquare size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Enter additional notes"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-600 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center mt-12 pb-10">
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="px-24 py-6 rounded-full text-lg font-semibold bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 border-none shadow-lg shadow-cyan-100 transition-all active:scale-[0.98]"
                    >
                        {isPending ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </div>
        </div>
    );
}