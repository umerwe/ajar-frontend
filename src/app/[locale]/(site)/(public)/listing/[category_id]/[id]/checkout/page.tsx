"use client"

import type React from "react"
import { Calendar, Clock, Star } from "lucide-react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGetMarketplaceListing } from "@/hooks/useListing"
import { useCreateBooking } from "@/hooks/useBooking"
import { capitalizeWords } from "@/utils/capitalizeWords"
import Header from "@/components/ui/header"
import type { BookingRequest } from "@/types/booking"
import { type BookingFormData, bookingSchema } from "@/validations/booking"
import SkeletonLoader from "@/components/common/skeleton-loader"
import PrivateComponent from "@/components/private-component"

const CheckoutPage = () => {
    const params = useParams()
    const id = params?.id as string

    const { data: listing, isLoading } = useGetMarketplaceListing(id)
    const { mutateAsync: createBooking, isPending } = useCreateBooking()

    const isHourly = listing?.priceUnit === "hour"

    const rawPrice = listing?.price || 0;
    const adminFee = listing?.adminFee || 0;
    const tax = listing?.tax || 0;
    const total = rawPrice + adminFee + tax;

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

    const watchedStartDate = watch("startDate")
    const watchedEndDate = watch("endDate")

    const formatDisplayDateTime = (dateTimeString: string, placeholder: string) => {
        if (!dateTimeString) return placeholder;
        const dateObj = new Date(dateTimeString);

        return dateObj.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            ...(isHourly && {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setValue(name as keyof BookingFormData, value)
        trigger(name as keyof BookingFormData)
    }

    const onSubmit = async (data: BookingFormData) => {
        if (!listing?._id) return

        const bookingPayload: BookingRequest = {
            marketplaceListingId: listing._id,
            dates: {
                checkIn: isHourly ? new Date(data.startDate).toISOString() : data.startDate,
                checkOut: isHourly ? new Date(data.endDate).toISOString() : data.endDate,
            },
            specialRequest: data.specialRequest || "",
        };


        await createBooking({ booking: bookingPayload })
    }

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return isHourly ? now.toISOString().slice(0, 16) : now.toISOString().split('T')[0];
    }

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

                                            {/* Lease Start Input */}
                                            <div className="space-y-2">
                                                <div
                                                    className={`relative bg-gray-100 rounded-lg p-3 md:p-4 cursor-pointer hover:bg-gray-200 transition-colors ${errors.startDate ? "border border-red-500" : ""}`}
                                                    onClick={() => (document.getElementById('startDate') as any)?.showPicker()}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Calendar className="w-4 h-4 text-gray-600 shrink-0" />
                                                        <label className="text-xs md:text-sm font-medium text-gray-900 cursor-pointer">Lease Start</label>
                                                    </div>

                                                    <p className="text-sm text-gray-500">
                                                        {formatDisplayDateTime(watchedStartDate, isHourly ? "Select Date & Time" : "Select Date")}
                                                    </p>

                                                    <input
                                                        id="startDate"
                                                        // DYNAMIC TYPE
                                                        type={isHourly ? "datetime-local" : "date"}
                                                        min={getMinDateTime()}
                                                        {...register("startDate")}
                                                        onChange={handleInputChange}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                                {errors.startDate && (
                                                    <p className="text-red-500 text-sm font-medium px-2">{errors.startDate.message}</p>
                                                )}
                                            </div>

                                            {/* Lease End Input */}
                                            <div className="space-y-2">
                                                <div
                                                    className={`relative bg-gray-100 rounded-lg p-3 md:p-4 cursor-pointer hover:bg-gray-200 transition-colors ${errors.endDate ? "border border-red-500" : ""}`}
                                                    onClick={() => (document.getElementById('endDate') as any)?.showPicker()}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Clock className="w-4 h-4 text-gray-600 shrink-0" />
                                                        <label className="text-xs md:text-sm font-medium text-gray-900 cursor-pointer">Lease End</label>
                                                    </div>

                                                    <p className="text-sm text-gray-500">
                                                        {formatDisplayDateTime(watchedEndDate, isHourly ? "Select Date & Time" : "Select Date")}
                                                    </p>

                                                    <input
                                                        id="endDate"
                                                        // DYNAMIC TYPE
                                                        type={isHourly ? "datetime-local" : "date"}
                                                        min={watchedStartDate || getMinDateTime()}
                                                        {...register("endDate")}
                                                        onChange={handleInputChange}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                                {errors.endDate && (
                                                    <p className="text-red-500 text-sm font-medium px-2">{errors.endDate.message}</p>
                                                )}
                                            </div>
                                        </div>
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
                                                    <span className="bg-teal-500 text-white px-3 py-1 rounded-l-2xl rounded-b-2xl text-sm font-medium">
                                                        {(listing?.ratings?.average || 0).toFixed(1)}/5
                                                    </span>
                                                    <span className="text-sm text-gray-500">{listing?.ratings?.count || 0} reviews</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base text-gray-600">Base price</span>
                                                <span className="text-base font-medium text-gray-900">${(rawPrice || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-base text-gray-600">Admin Fee</span>
                                                <span className="text-base font-medium text-gray-900">${(adminFee || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-base text-gray-600">Tax</span>
                                                <span className="text-base font-medium text-gray-900">${(tax || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-t">
                                                <span className="text-base font-medium text-gray-900">Total Cost</span>
                                                <span className="text-xl font-bold text-gray-900">${(total || 0).toFixed(2)}</span>
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