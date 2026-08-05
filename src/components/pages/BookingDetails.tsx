"use client"

import Header from "@/components/ui/header"
import ImageGalleryLayout from "@/components/pages/details/image-gallery-layout"
import PricingActions from "@/components/pages/details/pricing-actions"
import HostInfo from "@/components/pages/details/host-info"
import { useParams } from "next/navigation"
import ExploreArea from "@/components/pages/details/explore-area"
import AboutListing from "@/components/pages/details/about-listing"
import SkeletonLoader from "@/components/common/skeleton-loader"
import { useGetBookingId } from "@/hooks/useBooking"
import NotFound from "@/components/common/not-found"
import Timeline from "@/components/pages/details/time-line"

const BookingDetails = () => {
  const params = useParams()
  const category_id = params?.category_id as string
  const id = params?.id as string

  const { data, isLoading } = useGetBookingId(id);

  const listingData = { ...data?.marketplaceListingId, totalReviews: data?.totalReviews, averageRating: data?.averageRating };

  const hasValidListing = !listingData?._id;

  const showReturnOtp = data?.status === "in_progress" && !!data?.returnOtp;


  return (
    <div className="space-y-[25px]">
      <Header
        status={data?.status}
        title="Booking Details"
        isBookingLoading={isLoading}
      />

      {isLoading ? (
        <div className="mt-6">
          <SkeletonLoader variant="listing" />
        </div>
      ) : hasValidListing ? (
        <NotFound type="bookingDetails" />
      ) : (
        <>
          <ImageGalleryLayout
            property={listingData}
          />

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
            {/* LEFT COLUMN */}
            <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col gap-[40px]">
              <AboutListing
                property={listingData}
              />

              <HostInfo
                property={listingData}
              />

              {showReturnOtp && (
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-[12px]">Return OTP</h2>
                  <div className="inline-flex items-center px-5 py-2.5 rounded-lg border border-dashed border-aqua/40 bg-aqua/5">
                    <span className="text-2xl font-bold text-aqua tracking-[0.4em]">{data.returnOtp}</span>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2">Share this code with the host to confirm the return.</p>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full md:w-2/5 lg:w-1/3 space-y-3 md:space-y-4">
              <PricingActions
                bookingData={data}
                category_id={category_id}
                id={id}
              />


              <ExploreArea
                property={listingData}
              />
            </div>
          </div>

          <Timeline
            property={data}
          />
        </>
      )}
    </div>
  )
}

export default BookingDetails;