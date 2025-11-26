"use client";

import React, { useState } from "react";
import { Star, Calendar } from 'lucide-react';
import { useParams } from "next/navigation";
import { useGetMarketplaceListing } from "@/hooks/useListing";
import Header from "@/components/pages/listing-details/header";
import { useCreateBooking } from "@/hooks/useBooking";
import { BookingRequest } from "@/types/booking";
import { capitalizeWords } from "@/utils/capitalizeWords";
import api from "@/lib/axios";
import Image from "next/image";

const CheckoutPage = () => {
    const params = useParams();
    const id = params?.id as string;
    const { data: listing } = useGetMarketplaceListing(id);
    const { mutateAsync: createBooking, isPending } = useCreateBooking();


    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        specialRequest: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!listing?._id) return;

        const bookingPayload: BookingRequest = {
            marketplaceListingId: listing._id,
            dates: {
                checkIn: formData.startDate,
                checkOut: formData.endDate,
            },
            specialRequest: formData.specialRequest,
        };

        createBooking({ booking: bookingPayload }, {
            onSuccess: async (data) => {
                try {
                    const x = await api.post('/api/payments/stripe/intent', {
                        bookingId: data.booking._id
                    })
                    console.log(x)
                } catch (error) {
                    console.log(error)
                }
            }
        });
    };


    return (
        <div className="min-h-screen bg-gray-50 sm:px-12 pb-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <Header title="Checkout" />

                <div className="grid grid-cols-1 my-6 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column - Booking Form */}
                    <div className="space-y-6 px-4 sm:px-0 order-2 lg:order-1">
                        {/* Date Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Date</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        Start
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                        placeholder="Select date"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        End
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                        placeholder="Select date"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Comment Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Comment</h2>
                            <textarea
                                name="specialRequest"
                                value={formData.specialRequest}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition resize-none"
                                placeholder="Enter your comments"
                            ></textarea>
                        </div>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="space-y-6 px-4 sm:px-0 order-1 lg:order-2">
                        {/* Listing Information */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex gap-4 mb-4">
                                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${listing?.rentalImages[0]}`}
                                        alt={listing?.name}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {capitalizeWords(listing?.name)}
                                    </h3>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(listing?.ratings?.average)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="bg-teal-500 text-white px-2.5 py-1 rounded-full text-sm font-medium">
                                            {listing?.ratings?.average.toFixed(1)}/5
                                        </span>
                                        <span className="text-sm font-medium text-teal-600">
                                            Excellent
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {listing?.ratings?.count} reviews
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Price</span>
                                    <span className="text-lg font-semibold text-gray-900">
                                        ${listing?.price.toFixed(2)}
                                    </span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">Total Cost</span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            ${listing?.price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-header text-white py-3 rounded-full font-semibold text-base hover:from-teal-600 hover:to-blue-600 transition shadow-lg hover:shadow-xl"
                        >
                            {isPending ? "Loading..." : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;