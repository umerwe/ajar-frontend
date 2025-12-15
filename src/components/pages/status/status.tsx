"use client";
import { useState, useCallback } from "react";
import MainCard from "@/components/cards/main-card";
import NotFound from "@/components/common/not-found";
import SkeletonLoader from "@/components/common/skeleton-loader";
import Pagination from "@/components/ui/pagination";
import { useBooking } from "@/hooks/useBooking";
import { Booking } from "@/types/booking";
import { Listing } from "@/types/listing";

const ITEMS_PER_PAGE = 10;

const Status = ({ status }: { status: string }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useBooking(status === "all" ? undefined : status, currentPage);

  const bookings = data?.data?.bookings || [];

  const totalItems = data?.data?.total || 0;
  const limit = data?.data?.limit || ITEMS_PER_PAGE;

  const totalPages = Math.ceil(totalItems / limit);

  const listings = bookings.map((x: Booking) => ({
    ...(x.marketplaceListingId as Listing),
    bookingId: x._id,
    totalPrice: x.priceDetails.totalPrice
  }));

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (totalItems === 0) {
    return <NotFound type="booking" />;
  }

  return (
      <div className="flex flex-col">
        <MainCard
          listings={listings}
          type="booking"
          isApproved={status === "approved"}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
  );
};

export default Status;