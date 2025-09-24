"use client";
import React from "react";
import MainCard from "@/components/cards/main-card";
import { BookingData } from "@/data/booking-data";
import { useBooking } from "@/hooks/useBooking";
import { Booking } from "@/types/booking";
import NotFound from "@/components/common/not-found";
import SkeletonLoader from "@/components/common/skeleton-loader";

const Status = ({ status }: { status: string }) => {
  const { data = [], isLoading } = useBooking(status);

  if (isLoading) return <SkeletonLoader />;

  const bookings = data?.data?.bookings.filter((x: Booking) => x.marketplaceListingId !== null) || [];

  if (!bookings.length && !isLoading) return <NotFound />;

  const completedListings = bookings
    .filter((x: BookingData) => x.status === status)
    .map((x: { marketplaceListingId: number }) => x?.marketplaceListingId);

  return (
    <div className="my-4">
      <MainCard listings={completedListings} />
    </div>
  );
};

export default Status;
