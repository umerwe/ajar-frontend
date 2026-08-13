"use client";

import { useState } from "react";
import {
    AlertCircle,
    ChevronDown,
    MessageSquare,
    FileText,
    Receipt,
    MinusCircle,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { useBooking } from "@/hooks/useBooking";
import { useSendRefundRequest, useGetRefundPreview } from "@/hooks/useRefund";
import { Listing } from "@/types/listing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function RefundRequestForm() {
    const t = useTranslations("translation");
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

    // Early return = renter already had the item. Deposit stays on hold and
    // platform fees are not refunded, so the summary reads differently.
    const isEarlyReturn = Boolean(preview?.isEarlyReturn);
    const breakdown = preview?.breakdown ?? [];
    const hasExtensions = breakdown.length > 1;

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
            <Header title={t("refundRequest")} />

            <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
                <div className="mb-8">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{t("submitRefund")}</h1>
                    <p className="text-sm text-gray-400 mt-1">{t("submitRefundDescription")}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8 space-y-6">
                            {/* Booking Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t("booking")}</label>
                                <div className="relative">
                                    <span className={`${iconClass} text-slate-400`}>
                                        <FileText size={18} />
                                    </span>
                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <ChevronDown size={18} />
                                    </span>
                                    <select
                                        className={`${inputClass} appearance-none cursor-pointer capitalize`}
                                        value={booking}
                                        onChange={(e) => setBooking(e.target.value)}
                                    >
                                        <option value="">
                                            {bookings?.length ? t("selectBooking") : t("noBookingsAvailable")}
                                        </option>
                                        {bookings?.map((b: { _id: string; marketplaceListingId: Listing }) => (
                                            <option key={b?._id} value={b?._id} className="capitalize">
                                                {typeof b?.marketplaceListingId === "object"
                                                    ? b?.marketplaceListingId?.name
                                                    : `${t("booking")} ${b?._id.slice(-4)}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Refund Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t("reasonForRefund")} <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <span className={`${iconClass} text-aqua`}>
                                        <AlertCircle size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder={t("refundReasonPlaceholder")}
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t("additionalNote")}</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-4 text-aqua pointer-events-none">
                                        <MessageSquare size={18} />
                                    </span>
                                    <textarea
                                        placeholder={t("additionalDetailsPlaceholder")}
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
                                {t("refundSummary")}
                            </h2>

                            {!booking ? (
                                <p className="text-sm text-gray-400 text-center py-8">{t("selectBookingForRefundBreakdown")}</p>
                            ) : isPreviewLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            {isEarlyReturn ? t("rentalAmount") : t("paidAmount")}
                                        </span>
                                        <span className="font-medium text-gray-700">${preview?.totalBookingAmount?.toFixed(2)}</span>
                                    </div>

                                    {/* Each extension is its own booking and gets refunded separately */}
                                    {hasExtensions && (
                                        <div className="space-y-1.5 pl-3 border-l-2 border-gray-200">
                                            {breakdown.map((line: any) => (
                                                <div key={line.booking} className="flex justify-between text-[11px]">
                                                    <span className="text-gray-400">
                                                        {line.isExtension ? t("extension") : t("booking")}
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {t("refundBreakdownAmount", {
                                                            price: `$${line.price?.toFixed(2)}`,
                                                            refundAmount: `$${line.refundAmount?.toFixed(2)}`,
                                                        })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">{t("deductionFee")}</span>
                                        <span className="font-medium text-red-500">-${preview?.deductionFee?.toFixed(2)}</span>
                                    </div>

                                    {(preview?.securityDeposit ?? 0) > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">{t("securityDeposit")}</span>
                                            {isEarlyReturn ? (
                                                <span className="font-medium text-amber-600 flex items-center gap-1">
                                                    <Clock size={13} />
                                                    {t("onHold")}
                                                </span>
                                            ) : (
                                                <span className="font-medium text-emerald-600">+${preview?.securityDeposit?.toFixed(2)}</span>
                                            )}
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">{t("estimatedRefund")}</span>
                                            <span className="font-medium text-gray-700">${preview?.estimatedRefund?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-800">{t("totalToWallet")}</span>
                                            <span className="text-xl font-bold text-aqua">
                                                ${preview?.totalToWallet?.toFixed(2) ?? "0.00"}
                                            </span>
                                        </div>
                                    </div>

                                    {isEarlyReturn && (
                                        <div className="bg-amber-50 p-3 rounded-xl flex gap-2 mt-4">
                                            <Clock size={16} className="text-amber-500 shrink-0" />
                                            <p className="text-[11px] text-amber-700">
                                                {(preview?.securityDeposit ?? 0) > 0
                                                    ? t("securityDepositHoldRefundMessage", { amount: `$${preview?.securityDeposit?.toFixed(2)}` })
                                                    : t("serviceFeesNotRefundedAfterRentalStarted")}
                                            </p>
                                        </div>
                                    )}

                                    {!preview?.isEligible && (
                                        <div className="bg-red-50 p-3 rounded-xl flex gap-2 mt-4">
                                            <MinusCircle size={16} className="text-red-500 shrink-0" />
                                            <p className="text-[11px] text-red-600">{t("outsideRefundWindow")}</p>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isPending || !booking || !refundReason}
                                        variant="destructive"
                                        className="w-full mt-4 py-6 rounded-2xl shadow-lg shadow-red-100"
                                    >
                                        {isPending ? t("submitting") : t("confirmAndSubmit")}
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
