"use client";

import React from "react";
import { Star, Calendar } from 'lucide-react';
import { useParams } from "next/navigation";
import { useGetMarketplaceListing } from "@/hooks/useListing";
import { useCreateBooking } from "@/hooks/useBooking";
import { BookingRequest } from "@/types/booking";
import { capitalizeWords } from "@/utils/capitalizeWords";
import api from "@/lib/axios";
import Image from "next/image";
import Header from "@/components/pages/listing-details/header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BookingFormData, bookingSchema } from "@/validations/booking";

const CheckoutPage = () => {
    const params = useParams();
    const id = params?.id as string;
    const { data: listing } = useGetMarketplaceListing(id);
    const { mutateAsync: createBooking, isPending } = useCreateBooking();

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
            startDate: '',
            endDate: '',
            specialRequest: '',
        }
    });

    const formData = watch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValue(name as keyof BookingFormData, value);

        // Trigger validation for the field that changed
        trigger(name as keyof BookingFormData);
    };

    const onSubmit = async (data: BookingFormData) => {
        if (!listing?._id) return;

        const bookingPayload: BookingRequest = {
            marketplaceListingId: listing._id,
            dates: {
                checkIn: data.startDate,
                checkOut: data.endDate,
            },
            specialRequest: data.specialRequest!,
        };

        createBooking({ booking: bookingPayload }, {
            onSuccess: async (bookingData) => {
                try {
                    const paymentResponse = await api.post('/api/payments/stripe/intent', {
                        bookingId: bookingData.booking._id
                    });
                    console.log(paymentResponse);
                    // Handle successful payment intent creation
                } catch (error) {
                    console.error('Payment error:', error);
                    // Handle payment error
                }
            },
            onError: (error) => {
                console.error('Booking error:', error);
                // Handle booking error
            }
        });
    };

    // Get today's date in YYYY-MM-DD format for min date
    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    // Calculate min end date (start date or today)
    const getMinEndDate = () => {
        return formData.startDate || getTodayDate();
    };

    return (
        <div className="min-h-screen bg-gray-50 mb-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <Header title="Booking Submission" />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
                        {/* Left Column - Form */}
                        <div className="space-y-6">
                            {/* Date Section */}
                            <div>
                                <h2 className="text-base font-semibold text-gray-900 mb-4">Date</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Start Date */}
                                    <div className="space-y-2">
                                        <div className={`bg-gray-100 rounded-lg p-4 ${errors.startDate ? 'border border-red-500' : ''}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-4 h-4 text-gray-600" />
                                                <label className="text-sm font-medium text-gray-900">
                                                    Lease Start
                                                </label>
                                            </div>
                                            <input
                                                type="date"
                                                min={getTodayDate()}
                                                {...register("startDate")}
                                                onChange={handleInputChange}
                                                className="w-full bg-transparent border-0 p-0 focus:ring-0 outline-none text-sm text-gray-500"
                                            />
                                        </div>
                                        {errors.startDate && (
                                            <p className="text-red-500 text-sm font-medium px-2">
                                                {errors.startDate.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* End Date */}
                                    <div className="space-y-2">
                                        <div className={`bg-gray-100 rounded-lg p-4 ${errors.endDate ? 'border border-red-500' : ''}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-4 h-4 text-gray-600" />
                                                <label className="text-sm font-medium text-gray-900">
                                                    Lease End
                                                </label>
                                            </div>
                                            <input
                                                type="date"
                                                min={getMinEndDate()}
                                                {...register("endDate")}
                                                onChange={handleInputChange}
                                                className="w-full bg-transparent border-0 p-0 focus:ring-0 outline-none text-sm text-gray-500"
                                            />
                                        </div>
                                        {errors.endDate && (
                                            <p className="text-red-500 text-sm font-medium px-2">
                                                {errors.endDate.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
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
                                        <p className="text-red-500 text-sm font-medium px-2">
                                            {errors.specialRequest.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-48 bg-header text-white py-3 rounded-full font-semibold text-base hover:bg-teal-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Submitting..." : "Submit"}
                            </button>
                        </div>

                        {/* Right Column - Booking Summary */}
                        <div className="space-y-6">
                            {/* Listing Card */}
                            <div className="bg-white rounded-lg p-6 shadow-sm">
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
                                        <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-1">
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
                                            <span className="text-sm font-medium text-teal-600">
                                                Excellent
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {listing?.ratings?.count || 0} reviews
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base text-gray-600">Base price</span>
                                        <span className="text-base font-medium text-gray-900">
                                            ${listing?.price?.toFixed(2) || "0.00"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-t">
                                        <span className="text-base font-medium text-gray-900">Total Cost</span>
                                        <span className="text-xl font-bold text-gray-900">
                                            ${listing?.price?.toFixed(2) || "0.00"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Cancellation Policy */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Policy</h2>
                                <div className="mb-3">
                                    <h3 className="text-base font-semibold text-gray-900 mb-2">Non-refundable</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        This booking cannot be modified, and no refund will be given if you cancel it. If you fail to check in, a penalty equivalent to the cancellation fee will be charged.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;