"use client"

import type React from "react"
import { Star, ShieldCheck, Info } from "lucide-react"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGetListingBookedDates, useGetMarketplaceListing } from "@/hooks/useListing"
import { useCreateBooking } from "@/hooks/useBooking"
import Header from "@/components/ui/header"
import type { BookingRequest } from "@/types/booking"
import { type BookingFormData, bookingSchema } from "@/validations/booking"
import SkeletonLoader from "@/components/common/skeleton-loader"
import PrivateComponent from "@/components/private-component"
import { calculateFrontendPrice, calculateProcessingFee } from "@/utils/priceCalculator"
import { useMemo, useState } from "react"
import DateRangeCalendar from "@/components/DateRangeCalendar"
import { toast } from "@/components/ui/toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import MyImage from "@/components/MyImage"
import { useUser } from "@/hooks/useAuth"
import { useRouter } from "@/i18n/navigation"
import { formatBookingDate } from "@/utils/formatDate"
import { useTranslations } from "next-intl"

const safeNumber = (value: unknown, fallback = 0) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
};

type BlockedSlotInterval = {
    start: Date;
    end: Date;
};

type BookingPaymentResponse = {
    clientSecret?: string;
    paymentIntentId?: string;
};

const getBookingPayment = (response: any): BookingPaymentResponse => {
    return response?.payment || response?.data?.payment || {};
};

const CheckoutPage = () => {
    const params = useParams()
    const router = useRouter();
    const id = params?.id as string
    const t = useTranslations("translation")

    const { data: listing, isLoading } = useGetMarketplaceListing(id);
    const { data } = useUser();

    if (data?.status === "inactive") {
        router.back();
    }

    const { mutateAsync: createBooking, isPending } = useCreateBooking()
    const isHourly = listing?.priceUnit === "hour";

    const [visibleMonth, setVisibleMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });

    const { data: bookedDatesData, isLoading: isLoadingDates } = useGetListingBookedDates({
        id,
        month: visibleMonth,
    });
    const blockedDates: string[] = bookedDatesData?.blockedDates ?? bookedDatesData?.fullyBlockedDates ?? [];
    const blockedSlots = bookedDatesData?.blockedSlots ?? [];
    const blockedSlotIntervals = useMemo<BlockedSlotInterval[]>(() => {
        return blockedSlots.flatMap((dayEntry: { date: string; slots: { from: string; to: string }[] }) =>
            dayEntry.slots.map(slot => ({
                start: new Date(`${dayEntry.date}T${slot.from}:00Z`),
                end: new Date(`${dayEntry.date}T${slot.to}:00Z`),
            }))
        );
    }, [blockedSlots]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        trigger,
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            startDate: "",
            endDate: "",
            specialRequest: "",
        },
    })

    const watchedStartDate = watch("startDate");
    const watchedEndDate = watch("endDate");

    // Helper to get Rental Policies
    const policies = listing?.rentalPolicy;

    // Calculate Deposit Amount
    const depositAmount = useMemo(() => {
        if (policies?.securityDepositRules?.depositRequired) {
            return Number(policies.securityDepositRules.depositAmount) || 0;
        }
        return 0;
    }, [policies]);

    const priceBreakdown = useMemo(() => {
        if (!listing || !watchedStartDate || !watchedEndDate) return null;

        return calculateFrontendPrice({
            basePrice: listing.price,
            unit: listing.priceUnit,
            startDate: watchedStartDate,
            endDate: watchedEndDate,
            adminCommissionRate: listing.adminFee,
            taxRate: listing.tax,
            dynamicPricing: listing.dynamicPricing,
        });
    }, [listing, watchedStartDate, watchedEndDate]);


    const displayBasePrice = safeNumber(priceBreakdown?.basePrice, safeNumber(listing?.price));
    const displayAdminFee = safeNumber(priceBreakdown?.adminFee, safeNumber(listing?.adminFee));
    const displayTax = safeNumber(priceBreakdown?.tax, safeNumber(listing?.tax));

    const displaySubtotal = safeNumber(priceBreakdown?.totalPrice, displayBasePrice + displayAdminFee + displayTax) + depositAmount;
    const displayProcessingFee = calculateProcessingFee(displaySubtotal);
    const displayTotal = displaySubtotal + displayProcessingFee;

    const dynamicPrice = safeNumber(listing?.dynamicPricing?.price, NaN);
    const hasDynamicPricing = Boolean(
        listing?.dynamicPricing?.startDate &&
        listing?.dynamicPricing?.endDate &&
        Number.isFinite(dynamicPrice)
    );

    const hasBlockedDateInRange = (rangeStart: string, rangeEnd: string) => {
        const startKey = rangeStart.slice(0, 10);
        const endKey = rangeEnd.slice(0, 10);
        const fromKey = startKey <= endKey ? startKey : endKey;
        const toKey = startKey <= endKey ? endKey : startKey;

        return blockedDates.some(date => date >= fromKey && date <= toKey);
    };

    const hasBlockedSlotInRange = (rangeStart: string, rangeEnd: string) => {
        const start = new Date(rangeStart);
        const end = new Date(rangeEnd);
        if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) return false;

        return blockedSlotIntervals.some(interval => start < interval.end && end > interval.start);
    };

    const selectedRangeHasUnavailableDates = (rangeStart: string, rangeEnd: string) => {
        return isHourly ? hasBlockedSlotInRange(rangeStart, rangeEnd) : hasBlockedDateInRange(rangeStart, rangeEnd);
    };

    const isDateBlocked = (dateStr: string) => {
        return blockedDates.includes(dateStr);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setValue(name as keyof BookingFormData, value)
        trigger(name as keyof BookingFormData)
    }

    const onSubmit = async (data: BookingFormData) => {
        if (!listing?._id) return;

        if (selectedRangeHasUnavailableDates(data.startDate, data.endDate)) {
            toast({
                description: isHourly
                    ? t("selectedTimeRangeUnavailable")
                    : t("selectedDateRangeUnavailable"),
                variant: "destructive",
            });
            return;
        }

        if (!isHourly) {
            const checkIn = new Date(data.startDate);
            const checkOut = new Date(data.endDate);
            const current = new Date(checkIn);

            while (current <= checkOut) {
                const dateStr = current.toISOString().split("T")[0];
                if (isDateBlocked(dateStr)) {
                    toast({
                        description: t("dateAlreadyBooked", { date: dateStr }),
                        variant: "destructive",
                    });
                    return;
                }
                current.setDate(current.getDate() + 1);
            }
        }

        const bookingPayload: BookingRequest = {
            marketplaceListingId: listing._id,
            dates: {
                checkIn: isHourly ? new Date(data.startDate).toISOString() : data.startDate,
                checkOut: isHourly ? new Date(data.endDate).toISOString() : data.endDate,
            },
            specialRequest: data.specialRequest || "",
        };

        const response = await createBooking({ booking: bookingPayload, redirectOnSuccess: false });
        const payment = getBookingPayment(response);

        if (!payment.clientSecret || !payment.paymentIntentId) {
            toast({
                title: t("paymentFailed"),
                description: t("paymentDetailsNotReceived"),
                variant: "destructive",
            });
            return;
        }

        sessionStorage.setItem(
            "bookingPayment",
            JSON.stringify({
                clientSecret: payment.clientSecret,
                paymentIntentId: payment.paymentIntentId,
                amount: displayTotal,
            })
        );
        router.push("/booking/payment");
    };

    return (
        <PrivateComponent>
            <div className="min-h-screen">
                <div className="px-4 md:px-0">
                    <Header title={t("bookingSubmission")} />
                    {isLoading ? (
                        <SkeletonLoader variant="checkout" />
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">

                                {/* LEFT COLUMN */}
                                <div className="space-y-6">
                                    {/* Rental Policies Section */}
                                    {policies && (
                                        <div className="bg-aqua/5 border border-aqua/20 rounded-2xl p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-aqua p-2 rounded-lg">
                                                    <ShieldCheck className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900">{t("rentalPolicies")}</h3>
                                                    <p className="text-xs text-gray-500">{t("securityDepositTermsApply")}</p>
                                                </div>
                                            </div>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button type="button" className="text-aqua text-sm font-medium hover:underline flex items-center gap-1">
                                                        {t("viewDetails")} <Info className="w-3 h-3" />
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md bg-white rounded-2xl shadow-xl border-0">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-xl font-bold text-gray-900 border-b pb-3">
                                                            {t("rentalPoliciesAndTerms")}
                                                        </DialogTitle>
                                                    </DialogHeader>

                                                    <div className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                                        {policies.securityDepositRules?.depositRequired && (
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-semibold text-gray-500">
                                                                    {t("securityDeposit")}
                                                                </h4>
                                                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                                                        ${policies.securityDepositRules.depositAmount}
                                                                        {policies.securityDepositRules?.disputeWindowDays ? (
                                                                            <span className="block text-xs text-gray-500 mt-1 normal-case">
                                                                                {t("disputeWindow")}: {policies.securityDepositRules.disputeWindowDays} {t("daysShort")}
                                                                            </span>
                                                                        ) : null}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Condition Section */}
                                                        {policies.securityDepositRules?.depositConditions && (
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-semibold text-gray-500">
                                                                    {t("depositConditions")}
                                                                </h4>
                                                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                                    <p className="text-sm text-gray-700 leading-relaxed font-medium first-letter:uppercase">
                                                                        {policies.securityDepositRules.depositConditions}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Damage & Liability Section */}
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-semibold text-gray-500">
                                                                {t("damageAndLiability")}
                                                            </h4>
                                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                                <p className="text-sm text-gray-700 leading-relaxed font-medium first-letter:uppercase">
                                                                    {policies.damageLiabilityTerms?.responsibilityClause || t("noLiabilityDescription")}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {policies.rentalDurationLimits?.length > 0 && (
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-semibold text-gray-500">
                                                                    Rental duration limits
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {policies.rentalDurationLimits.map((limit: {
                                                                        appliesToPriceUnit: string;
                                                                        minimumDuration?: { value: number; unit: string };
                                                                        maximumDuration?: { value: number; unit: string };
                                                                    }, index: number) => (
                                                                        <div key={`${limit.appliesToPriceUnit}-${index}`} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                                            <p className="text-sm text-gray-700 leading-relaxed font-medium first-letter:uppercase">
                                                                                {limit.appliesToPriceUnit} {t("rental")}: {limit.minimumDuration?.value ?? 0} {limit.minimumDuration?.unit ?? limit.appliesToPriceUnit} {t("minimum")}
                                                                                {" - "}
                                                                                {limit.maximumDuration?.value ?? 0} {limit.maximumDuration?.unit ?? limit.appliesToPriceUnit} {t("maximum")}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Extension Allowed Status */}
                                                        <div className="pt-4 border-t flex items-center gap-2 sticky bottom-0 bg-white pb-2">
                                                            <div className={`w-2 h-2 rounded-full ${policies.extensionAllowed ? 'bg-green-500' : 'bg-red-500'}`} />
                                                            <p className="text-xs font-bold text-gray-700">
                                                                {policies.extensionAllowed
                                                                    ? t("extensionAllowed")
                                                                    : t("extensionNotAllowed")
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}

                                    <div>
                                        <h2 className="text-base font-semibold text-gray-900 mb-4">{t("reservationDates")}</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <DateRangeCalendar
                                                isHourly={isHourly}
                                                blockedDates={blockedDates}
                                                blockedSlots={blockedSlots}
                                                startDate={watchedStartDate}
                                                endDate={watchedEndDate}
                                                isLoadingDates={isLoadingDates}
                                                dynamicPricing={listing?.dynamicPricing}
                                                onMonthChange={(month) => setVisibleMonth(month)}
                                                onRangeChange={(start, end) => {
                                                    setValue("startDate", start)
                                                    setValue("endDate", end)
                                                    trigger(["startDate", "endDate"])
                                                    if (start) setVisibleMonth(start.substring(0, 7))
                                                }}
                                            />
                                        </div>
                                        {errors.startDate && <p className="text-red-500 text-sm px-2">{errors.startDate.message}</p>}
                                        {errors.endDate && <p className="text-red-500 text-sm px-2">{errors.endDate.message}</p>}
                                    </div>

                                    <div>
                                        <h2 className="text-base font-semibold text-gray-900 mb-4">{t("comments")}</h2>
                                        <textarea
                                            {...register("specialRequest")}
                                            onChange={handleInputChange}
                                            rows={6}
                                            className="w-full px-4 py-4 bg-gray-100 border-0 rounded-lg focus:ring-1 focus:ring-aqua outline-none transition resize-none text-sm text-gray-500 placeholder:text-gray-500"
                                            placeholder={t("enterSpecialRequests")}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full sm:w-48 bg-header text-white py-3 rounded-full font-medium text-sm md:text-base hover:bg-teal-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPending ? t("processing") : t("submitBooking")}
                                    </button>
                                </div>

                                {/* RIGHT COLUMN: Summary */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100">
                                        <div className="flex gap-4 mb-4">
                                            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                {listing?.rentalImages?.[0] && (
                                                    <MyImage
                                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${listing.rentalImages[0]}`}
                                                        alt={listing?.name || "Listing image"}
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm md:text-lg font-semibold capitalize text-gray-900 mt-2 mb-1">
                                                    {listing?.name || ""}
                                                </h3>
                                                <div className="flex items-center gap-1 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.floor(listing?.ratings?.average || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="bg-aqua text-white px-3 py-1 rounded-l-2xl rounded-b-2xl text-sm font-medium">
                                                        {Number(listing?.averageRating || 0).toFixed(1)}/5
                                                    </span>
                                                    <span className="text-sm text-gray-500">{listing?.totalReviews || 0} {t("reviews")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("paymentDetails")}</h2>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base text-gray-600">
                                                    {t("basePrice")} {priceBreakdown ? `(${priceBreakdown.duration} ${listing?.priceUnit}${priceBreakdown.duration > 1 ? 's' : ''})` : ""}
                                                </span>
                                                <span className="text-base font-medium text-gray-900">${displayBasePrice.toFixed(2)}</span>
                                            </div>
                                            
                                            {displayAdminFee > 0 && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-base text-gray-600">{t("adminFee")}</span>
                                                    <span className="text-base font-medium text-gray-900">${displayAdminFee.toFixed(2)}</span>
                                                </div>
                                            )}
                                            {displayTax > 0 && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-base text-gray-600">{t("tax")}</span>
                                                    <span className="text-base font-medium text-gray-900">${displayTax.toFixed(2)}</span>
                                                </div>
                                            )}

                                            {hasDynamicPricing && listing?.dynamicPricing && (
                                                <div className="flex justify-between items-start gap-4 rounded-lg bg-aqua/5 px-3 py-2 text-aqua">
                                                    <div>
                                                        <span className="text-sm font-medium">{t("specialOffer")}</span>
                                                        <p className="text-[11px] text-gray-500">
                                                            {formatBookingDate(listing.dynamicPricing.startDate, listing.priceUnit)} - {formatBookingDate(listing.dynamicPricing.endDate, listing.priceUnit)}
                                                        </p>
                                                    </div>
                                                    <span className="text-sm font-semibold whitespace-nowrap">
                                                        ${dynamicPrice.toFixed(2)}/{listing.priceUnit}
                                                    </span>
                                                </div>
                                            )}

                                            {/* NEW: Refundable Deposit Line Item */}
                                            {depositAmount > 0 && (
                                                <div className="flex justify-between items-center text-aqua">
                                                    <span className="text-base">{t("refundableDeposit")}</span>
                                                    <span className="text-base font-medium">${depositAmount.toFixed(2)}</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center">
                                                <span className="text-base text-gray-600">{t("processingFee")}</span>
                                                <span className="text-base font-medium text-gray-900">${displayProcessingFee.toFixed(2)}</span>
                                            </div>

                                            <div className="flex justify-between items-center py-3 border-t">
                                                <span className="text-base font-medium text-gray-900">{t("totalCost")}</span>
                                                <span className="text-xl font-semibold text-gray-900">
                                                    ${displayTotal.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 text-right italic">* {t("processingFeeNonRefundable")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </PrivateComponent>
    )
}

export default CheckoutPage
