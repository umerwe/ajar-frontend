"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Users, Bed, Wifi, Clock, Info } from 'lucide-react';
import Header from "@/components/pages/listing-details/header";
import GuestInformationFields from "@/components/forms/guest-information-fields";
import PriceDetails from "@/components/pages/check-out/price-details";
import PaymentFields from "@/components/forms/payment-fields";
import CheckInOutTime from "@/components/pages/check-out/check-in-out-time";
import Image from "next/image";
import CancellationPolicy from "@/components/pages/check-out/cancellation-policy";
import { Button } from "@/components/ui/button";
import { CombinedFormData, combinedSchema } from "@/validations/checkout";
import { useParams } from "next/navigation";
import { useGetBookingId } from "@/hooks/useBooking";

// Types for listing and booking data
interface Listing {
    name: string;
    images: string[];
    ratings: {
        average: number;
        count: number;
    };
}

interface BookingData {
    marketplaceListingId: Listing;
    noOfGuests: number;
    dates: {
        checkIn: string;
        checkOut: string;
    };
    priceDetails: {
        price: number;
        adminFee: number;
        totalPrice: number;
    };
}

interface CheckoutPageClientProps {
    listing: Listing;
    isVehicle: boolean;
    data: BookingData;
    bedType: string;
    guestsOrPassengers: number;
    inclusions: string[];
    roomSize: string;
    cancellationPolicy: string;
    cancellationDescription: string;
    isLoading: boolean;
}

const CheckoutPage = () => {
    const params = useParams();
    const id = params?.id as string;

    const { data, isLoading } = useGetBookingId(id);

    const listing = data?.marketplaceListingId;
    const isVehicle = true;
    const bedType = "1 Double Bed";
    const guestsOrPassengers = 2;
    const inclusions = ["Free WiFi", "Air Conditioning", "Parking"];
    const roomSize = "Unknown";
    const cancellationPolicy = "Non-refundable";
    const cancellationDescription = data
        ? "You can cancel this booking for free up to 48 hours before check-in."
        : "This booking cannot be modified, and no refund will be given if you cancel it. If you fail to check in, a penalty equivalent to the cancellation fee will be charged.";

    return <CheckoutPageClient
        listing={listing}
        data={data!} // non-null assertion since data is required
        isVehicle={isVehicle}
        bedType={bedType}
        guestsOrPassengers={guestsOrPassengers}
        inclusions={inclusions}
        roomSize={roomSize}
        cancellationPolicy={cancellationPolicy}
        cancellationDescription={cancellationDescription}
        isLoading={isLoading}
    />;
};

const CheckoutPageClient = ({
    listing,
    isVehicle,
    bedType,
    inclusions,
    roomSize,
    data,
    cancellationPolicy,
    cancellationDescription,
    isLoading
}: CheckoutPageClientProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CombinedFormData>({
        resolver: zodResolver(combinedSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            countryCode: "+92",
            phoneNumber: "",
            name: '',
            expiryDate: '',
            billingZip: '',
            paymentOption: "full",
            cardType: "VISA",
        },
    });

    const onSubmit = (formData: CombinedFormData) => {
        console.log("Complete Booking Form Submitted:", formData);
    };

    if (isLoading) {
        return <div>Loading</div>
    }

    return (
        <div className="min-h-screen sm:px-12 mb-20">
            <div className="max-w-7xl mx-auto">
                <Header title="Checkout" />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-12">
                        {/* Left Column - Form */}
                        <div className="space-y-6">
                            {/* Guest Information */}
                            <div className="bg-white rounded-lg py-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {"Who's checking in?"}
                                </h2>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-700 font-semibold mb-2">
                                        <span className="text-red-800 mr-1">*</span>
                                        Required
                                    </p>
                                    <button type="button" className="text-sm text-aqua hover:text-teal-700 font-medium">
                                        Sign in for faster checkout
                                    </button>
                                </div>
                                <GuestInformationFields
                                    register={register}
                                    setValue={setValue}
                                    errors={errors}
                                />
                            </div>
                            <PaymentFields
                                register={register}
                                setValue={setValue}
                                errors={errors}
                            />
                            <CancellationPolicy />
                            <Button
                                type="submit"
                                variant="destructive"
                                className="w-full sm:w-auto md:w-full lg:w-auto px-9">
                                Complete Booking
                            </Button>
                        </div>
                        {/* Right Column - Booking Summary */}
                        <div className="space-y-6 pl-2 lg:pl-12 mb-20">
                            {/* Listing Information */}
                            <div className="bg-white rounded-lg py-2">
                                <div className="flex gap-4 mb-4">
                                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                                        <Image
                                            src={listing.images[0]}
                                            alt={listing?.name || "listing-img"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 sm:mb-1">
                                            {listing.name || "Untitled Listing"}
                                        </h3>
                                        <div className="flex items-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(listing.ratings.count || 0)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="bg-teal-500 text-white px-2.5 py-1 rounded text-sm font-medium rounded-l-full rounded-b-full">
                                                {(listing.ratings.average || 0).toFixed(1)}/5
                                            </span>
                                            <span className="text-md font-medium text-teal-600">
                                                {(listing.ratings.average || 0) >= 4.5
                                                    ? "Excellent"
                                                    : (listing.ratings.average || 0) >= 4.0
                                                        ? "Good"
                                                        : "Average"}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {listing.ratings.count || 0} reviews
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Room/Vehicle Details */}
                                <div className="pt-4">
                                    <h4 className="font-semibold text-gray-900 mb-1 sm:mb-3">{listing.name}</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">x{data.noOfGuests}</span>
                                            {!isVehicle && (
                                                <>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-gray-900 cursor-pointer">
                                                        <u>{bedType}</u>
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-teal-600 font-medium">
                                                {inclusions[0] || "N/A"}
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <Wifi className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{inclusions[1] || "N/A"}</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-600">{inclusions[2] || "N/A"}</span>
                                        </div>
                                        <div className="text-gray-600">{roomSize}</div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-3 text-gray-900 cursor-pointer">
                                        <Info className="w-4 h-4" />
                                        <span className="text-sm">
                                            <u>{cancellationPolicy}</u>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Check-in/Check-out Time */}
                            <div className="bg-white rounded-lg">
                                <div className="flex flex-wrap justify-between gap-4">
                                    <CheckInOutTime
                                        date={data.dates.checkIn}
                                        icon={<Clock className="w-4 h-4 text-gray-400" />}
                                        label={isVehicle ? "rental day" : "night"}
                                        options={[
                                            { value: 1, label: `1 ${isVehicle ? "day" : "night"}` },
                                            { value: 2, label: `2 ${isVehicle ? "days" : "nights"}` },
                                            { value: 3, label: `3 ${isVehicle ? "days" : "nights"}` },
                                        ]}
                                    />
                                    <CheckInOutTime
                                        date={data.dates.checkOut}
                                        icon={<Bed className="w-4 h-4 text-gray-400" />}
                                        label={isVehicle ? "vehicle" : "room"}
                                        options={[
                                            { value: 1, label: `1 ${isVehicle ? "vehicle" : "room"}` },
                                            { value: 2, label: `2 ${isVehicle ? "vehicles" : "rooms"}` },
                                            { value: 3, label: `3 ${isVehicle ? "vehicles" : "rooms"}` },
                                        ]}
                                    />
                                </div>
                            </div>
                            <PriceDetails
                                pricingDetails={data.priceDetails}
                            />
                            {/* Cancellation Policy */}
                            <div className="bg-white rounded-lg sm:p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    Cancellation Policy
                                </h4>
                                <div className="mb-3">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {cancellationPolicy}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed max-w-90">
                                    {cancellationDescription}
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
