"use client"

import type React from "react"
import { Star } from "lucide-react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGetListingBookedDates, useGetMarketplaceListing } from "@/hooks/useListing"
import { useCreateBooking } from "@/hooks/useBooking"
import { capitalizeWords } from "@/utils/capitalizeWords"
import Header from "@/components/ui/header"
import type { BookingRequest } from "@/types/booking"
import { type BookingFormData, bookingSchema } from "@/validations/booking"
import SkeletonLoader from "@/components/common/skeleton-loader"
import PrivateComponent from "@/components/private-component"
import { calculateFrontendPrice } from "@/utils/priceCalculator"
import { useMemo, useState } from "react"
import DateRangeCalendar from "@/components/DateRangeCalendar"


const CheckoutPage = () => {
    const params = useParams()
    const id = params?.id as string

    const { data: listing, isLoading } = useGetMarketplaceListing(id)
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
    const blockedDates: string[] = bookedDatesData?.blockedDates ?? [];
    const blockedSlots = bookedDatesData?.blockedSlots ?? [];

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

    const priceBreakdown = useMemo(() => {
        if (!listing || !watchedStartDate || !watchedEndDate) return null;

        return calculateFrontendPrice({
            basePrice: listing.price,
            unit: listing.priceUnit,
            startDate: watchedStartDate,
            endDate: watchedEndDate,
            adminCommissionRate: listing.adminFee,
            taxRate: listing.tax,
        });
    }, [listing, watchedStartDate, watchedEndDate]);


    const displayBasePrice = priceBreakdown?.basePrice ?? listing?.price ?? 0;
    const displayAdminFee = priceBreakdown?.adminFee ?? listing?.adminFee ?? 0;
    const displayTax = priceBreakdown?.tax ?? listing?.tax ?? 0;
    const displayTotal = priceBreakdown?.totalPrice ?? (displayBasePrice + displayAdminFee + displayTax);

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

        // Block submission if selected dates are blocked
        if (!isHourly) {
            const checkIn = new Date(data.startDate);
            const checkOut = new Date(data.endDate);
            const current = new Date(checkIn);

            while (current <= checkOut) {
                const dateStr = current.toISOString().split("T")[0];
                if (isDateBlocked(dateStr)) {
                    alert(`Date ${dateStr} is already booked. Please select different dates.`);
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

        await createBooking({ booking: bookingPayload });
    };

    return (
        <PrivateComponent>
            <div className="min-h-screen">
                <div className="px-4 md:px-0">
                    <Header title="Booking Submission" />
                    {isLoading ? (
                        <SkeletonLoader variant="checkout" />
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">

                                {/* LEFT COLUMN */}
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-base font-semibold text-gray-900 mb-4">Reservation Dates</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <DateRangeCalendar
                                                isHourly={isHourly}
                                                blockedDates={blockedDates}
                                                blockedSlots={blockedSlots}
                                                startDate={watchedStartDate}
                                                endDate={watchedEndDate}
                                                isLoadingDates={isLoadingDates} // ✅ loader
                                                onMonthChange={(month) => setVisibleMonth(month)} // ✅ month change → refetch
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

                                    {/* Comments Section */}
                                    <div>
                                        <h2 className="text-base font-semibold text-gray-900 mb-4">Comments</h2>
                                        <textarea
                                            {...register("specialRequest")}
                                            onChange={handleInputChange}
                                            rows={6}
                                            className="w-full px-4 py-4 bg-gray-100 border-0 rounded-lg focus:ring-1 focus:ring-aqua outline-none transition resize-none text-sm text-gray-500 placeholder:text-gray-500"
                                            placeholder="Enter any special requests"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full sm:w-48 bg-header text-white py-3 rounded-full font-medium text-sm md:text-base hover:bg-teal-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPending ? "Processing..." : "Submit Booking"}
                                    </button>
                                </div>

                                {/* RIGHT COLUMN: Summary */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100">
                                        <div className="flex gap-4 mb-4">
                                            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                {listing?.rentalImages?.[0] && (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${listing.rentalImages[0]}`}
                                                        alt={listing?.name || "Listing image"}
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm md:text-lg font-semibold text-gray-900 mt-2 mb-1">
                                                    {capitalizeWords(listing?.name || "")}
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
                                                        {(listing?.averageRating ? listing.averageRating.toFixed(1) : 0 || 0).toFixed(1)}/5
                                                    </span>
                                                    <span className="text-sm text-gray-500">{listing?.totalReviews || 0} reviews</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base text-gray-600">
                                                    Base price {priceBreakdown ? `(${priceBreakdown.duration} ${listing?.priceUnit}${priceBreakdown.duration > 1 ? 's' : ''})` : ""}
                                                </span>
                                                <span className="text-base font-medium text-gray-900">${displayBasePrice.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-base text-gray-600">Admin Fee</span>
                                                <span className="text-base font-medium text-gray-900">${displayAdminFee.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-base text-gray-600">Tax</span>
                                                <span className="text-base font-medium text-gray-900">${displayTax.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-t">
                                                <span className="text-base font-medium text-gray-900">Total Cost</span>
                                                <span className="text-xl font-semibold text-gray-900">
                                                    ${displayTotal.toFixed(2)}
                                                    <span className="text-sm font-normal text-gray-500">/{listing?.priceUnit}</span>
                                                </span>
                                            </div>
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