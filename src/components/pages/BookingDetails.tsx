"use client"

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const BookingDetails = () => {
  const [isDamagedReportOpen, setIsDamagedReportOpen] = useState(false)
  const params = useParams()
  const category_id = params?.category_id as string
  const id = params?.id as string

  const { data, isLoading } = useGetBookingId(id);

  const listingData = { ...data?.marketplaceListingId, totalReviews: data?.totalReviews, averageRating: data?.averageRating };

  const hasValidListing = !listingData?._id;

  const showReturnOtp = data?.status === "in_progress" && !!data?.returnOtp;
  const damagedReport = data?.damagedReport;
  const showDamagedReport = data?.status === "completed" && !!damagedReport && data?.hasDamagedReport;
  const attachmentBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";


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

              {showDamagedReport && (
                <div>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-auto px-6"
                    onClick={() => setIsDamagedReportOpen(true)}
                  >
                    Damage Report
                  </Button>
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

          <Dialog open={isDamagedReportOpen} onOpenChange={setIsDamagedReportOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Damage Report</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="grid gap-3 text-sm">
                  <div className="flex items-start justify-between gap-4 border-b pb-3">
                    <span className="text-gray-500 font-medium">Issue Type</span>
                    <span className="text-right font-semibold text-gray-900">{damagedReport?.issueType || "N/A"}</span>
                  </div>

                  <div className="flex items-start justify-between gap-4 border-b pb-3">
                    <span className="text-gray-500 font-medium">Status</span>
                    <span className="text-right font-semibold capitalize text-aqua">
                      {damagedReport?.status?.replace(/_/g, " ") || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 border-b pb-3">
                    <span className="text-gray-500 font-medium">Reported Charges</span>
                    <span className="text-right font-semibold text-gray-900">
                      ${Number(damagedReport?.damagedCharges || 0).toFixed(2)}
                    </span>
                  </div>

                  {damagedReport?.approvedAmount !== undefined && (
                    <div className="flex items-start justify-between gap-4 border-b pb-3">
                      <span className="text-gray-500 font-medium">Approved Amount</span>
                      <span className="text-right font-semibold text-gray-900">
                        ${Number(damagedReport.approvedAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1 border-b pb-3">
                    <span className="text-gray-500 font-medium">Report Text</span>
                    <p className="text-gray-800">{damagedReport?.rentalText || "N/A"}</p>
                  </div>

                  {damagedReport?.adminNote && (
                    <div className="space-y-1 border-b pb-3">
                      <span className="text-gray-500 font-medium">Admin Note</span>
                      <p className="text-gray-800">{damagedReport.adminNote}</p>
                    </div>
                  )}

                  {damagedReport?.attachments?.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-gray-500 font-medium">Attachments</span>
                      <div className="flex flex-wrap gap-2">
                        {damagedReport.attachments.map((attachment: string, index: number) => (
                          <a
                            key={`${attachment}-${index}`}
                            href={attachment.startsWith("http") ? attachment : `${attachmentBaseUrl}${attachment}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-aqua hover:bg-aqua/5"
                          >
                            Attachment {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

export default BookingDetails;
