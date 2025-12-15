"use client"

import CoreDetails from "@/components/pages/listing-details/core-details"
import Header from "@/components/ui/header"
import ImageGalleryLayout from "@/components/pages/listing-details/image-gallery-layout"
import PricingActions from "@/components/pages/listing-details/pricing-actions"
import Rating from "@/components/pages/listing-details/rating"
import HostInfo from "@/components/pages/listing-details/host-info"
import { useParams } from "next/navigation"
import ExploreArea from "@/components/pages/listing-details/explore-area"
import AboutListing from "@/components/pages/listing-details/about-listing"
import SkeletonLoader from "@/components/common/skeleton-loader"
import Error from "@/components/common/error"
import Document from "@/components/pages/listing-details/document"
import { useUser } from "@/hooks/useAuth"
import { useGetBookingId } from "@/hooks/useBooking"

const BookingDetails = () => {
  const params = useParams()
  const category_id = params?.category_id as string
  const id = params?.id as string

  const { data, isLoading, isError } = useGetBookingId(id);

  const listingData = data?.marketplaceListingId;
  const { data: user } = useUser();

  return (
    <div>
      <Header
        status={data?.status}
        title="Booking Details"
      />

      {isLoading ? (
        <div className="mt-6">
          <SkeletonLoader variant="listing" />
        </div>
      ) : isError ? (
        <Error />
      ) : (
        <>
          <ImageGalleryLayout
            property={listingData}
          />

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
            {/* LEFT COLUMN */}
            <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col gap-4">
              <CoreDetails
                property={listingData}
              />

              <Rating
                property={listingData}
              />

              {
                listingData.leaser._id === user?._id &&
                <Document property={listingData}
                />}

              <AboutListing
                property={listingData}
              />

              <HostInfo
                property={listingData}
              />
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
        </>
      )}
    </div>
  )
}

export default BookingDetails;