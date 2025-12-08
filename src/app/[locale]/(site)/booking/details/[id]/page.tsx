"use client"

// import AboutListing from "@/components/pages/listing-details/about-listing"
import CoreDetails from "@/components/pages/listing-details/core-details"
// import ExploreArea from "@/components/pages/listing-details/explore-area"
import Header from "@/components/pages/listing-details/header"
import ImageGalleryLayout from "@/components/pages/listing-details/image-gallery-layout"
import PricingActions from "@/components/pages/listing-details/pricing-actions"
import Rating from "@/components/pages/listing-details/rating"
import HostInfo from "@/components/pages/listing-details/host-info"
import ServicesAmenities from "@/components/pages/listing-details/services-amenities"
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
  console.log(data)

  const listingData = data?.marketplaceListingId;
  const { data: user } = useUser();

  if (isLoading) {
    return <SkeletonLoader variant="listing" />
  }

  if (isError) {
    return <Error />
  }

  return (
    <div className="mx-3 sm:mx-7">
      <Header
        status={data?.status}
        title="Booking Details"
      />

      <ImageGalleryLayout
        property={listingData}
      />

      {/* <Tabs
        id={id}
        defaultActive="Overview"
        activeClass="border-b-2 border-aqua text-aqua font-semibold"
        inactiveClass="hover:text-aqua"
      /> */}

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 px-3 md:px-6">
        {/* LEFT COLUMN */}
        <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col gap-4">
          <CoreDetails
            property={listingData}
          />

          {/* <Features
            freeCancellation={property.freeCancellation}
            noPrepayment={property.noPrepayment}
            layout="inline"
          /> */}

          <Rating
            property={listingData}
          />

          {
            listingData.leaser._id === user?._id && (
              <Document property={listingData} />
            )
          }

          {/* <GuestLikedPost property={property} /> */}

          <AboutListing
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

      <div className="sm:px-3">
        <HostInfo
          property={listingData}
        />

        {/* <Tabs
          id={id}
          defaultActive="Rooms"
        /> */}

        <div className="mt-8">
          {/* <GuestReview property={property} /> */}

          {/* <MostMentionedTabs property={property} /> */}

          {/* <GuestImpressions property={property} /> */}
        </div>
      </div>

      <ServicesAmenities />
    </div>
  )
}

export default BookingDetails
