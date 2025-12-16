"use client"

import type React from "react"
import { Calendar, Star } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton
import SkeletonLoader from "@/components/common/skeleton-loader"

const CheckoutPage = () => {
    const params = useParams()
    const id = params?.id as string

    const { data: listing, isLoading } = useGetMarketplaceListing(id)
    const { mutateAsync: createBooking, isPending } = useCreateBooking()

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

    const formData = watch()

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
                checkIn: data.startDate,
                checkOut: data.endDate,
            },
            specialRequest: data.specialRequest!,
        }

        await createBooking(
            { booking: bookingPayload }
        )
    }

    const getTodayDate = () => {
        return new Date().toISOString().split("T")[0]
    }

    const getMinEndDate = () => {
        return formData.startDate || getTodayDate()
    }

    return (
        <div className="min-h-screen">
            <div>
                <Header title="Booking Submission" />
                {isLoading ? 
                <SkeletonLoader variant="checkout" /> :
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">

                        {/* LEFT COLUMN: Booking Details/Submit Button */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900 mb-4">Date</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Lease Start Input */}
                                    <div className="space-y-2">
                                        <div className={`bg-gray-100 rounded-lg p-3 md:p-4 ${errors.startDate ? "border border-red-500" : ""}`}>
                                            <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                                                <Calendar className="w-4 h-4 text-gray-600 shrink-0" />
                                                <label className="text-xs md:text-sm font-medium text-gray-900 whitespace-nowrap">Lease Start</label>
                                            </div>
                                            <input
                                                type="date"
                                                min={getTodayDate()}
                                                {...register("startDate")}
                                                onChange={handleInputChange}
                                                className="w-full bg-transparent border-0 p-0 focus:ring-0 outline-none text-sm text-gray-500 min-w-0"
                                            />
                                        </div>
                                        {errors.startDate && (
                                            <p className="text-red-500 text-sm font-medium px-2">{errors.startDate.message}</p>
                                        )}
                                    </div>

                                    {/* Lease End Input */}
                                    <div className="space-y-2">
                                        <div className={`bg-gray-100 rounded-lg p-3 md:p-4 ${errors.endDate ? "border border-red-500" : ""}`}>
                                            <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                                                <Calendar className="w-4 h-4 text-gray-600 shrink-0" />
                                                <label className="text-xs md:text-sm font-medium text-gray-900 whitespace-nowrap">Lease End</label>
                                            </div>
                                            <input
                                                type="date"
                                                min={getMinEndDate()}
                                                {...register("endDate")}
                                                onChange={handleInputChange}
                                                className="w-full bg-transparent border-0 p-0 focus:ring-0 outline-none text-sm text-gray-500 min-w-0"
                                            />
                                        </div>
                                        {errors.endDate && (
                                            <p className="text-red-500 text-sm font-medium px-2">{errors.endDate.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Comments Input Field */}
                            <div>
                                <h2 className="text-base font-semibold text-gray-900 mb-4">Comments</h2>
                                <div className="space-y-2">
                                    <textarea
                                        {...register("specialRequest")}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className="w-full px-4 py-4 bg-gray-100 border-0 rounded-lg focus:ring-1 focus:ring-aqua outline-none transition resize-none text-sm text-gray-500 placeholder:text-gray-500"
                                        placeholder="Enter comments"
                                    ></textarea>
                                    {errors.specialRequest && (
                                        <p className="text-red-500 text-sm font-medium px-2">{errors.specialRequest.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Booking Submission Button */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full sm:w-48 bg-header text-white py-3 rounded-full font-semibold text-sm md:text-base hover:bg-teal-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Processing..." : "Submit Booking"}
                            </button>
                        </div>

                        {/* RIGHT COLUMN: Listing and Price Details (Unchanged) */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
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
                                                    className={`w-4 h-4 ${i < Math.floor(listing?.ratings?.average || 0)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="bg-teal-500 text-white px-3 py-1 rounded-l-2xl rounded-b-2xl text-sm font-medium">
                                                {(listing?.ratings?.average || 0).toFixed(1)}/5
                                            </span>
                                            <span className="text-sm font-medium text-teal-600">Excellent</span>
                                            <span className="text-sm text-gray-500">{listing?.ratings?.count || 0} reviews</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base text-gray-600">Base price</span>
                                        <span className="text-base font-medium text-gray-900">
                                            ${(listing?.price || 0).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-3 border-t">
                                        <span className="text-base font-medium text-gray-900">Total Cost</span>
                                        <span className="text-xl font-bold text-gray-900">
                                            ${(listing?.price || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>


                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Policy</h2>
                                <div className="mb-3">
                                    <h3 className="text-base font-semibold text-gray-900 mb-2">Non-refundable</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        This booking cannot be modified, and no refund will be given if you cancel it. If you fail to check
                                        in, a penalty equivalent to the cancellation fee will be charged.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>}
            </div>
        </div>
    )
}

export default CheckoutPage