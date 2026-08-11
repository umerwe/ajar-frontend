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
import { Clock } from "lucide-react"
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

  // Cancelling mid-rental settles like a completion: the item was out, so the
  // deposit stays on hold and the host can still raise a damage report.
  const isEarlyReturn =
    data?.status === "booking_cancelled" &&
    data?.cancelledFromStatus === "in_progress";

  // The host confirms the return with this PIN — on an early return that is
  // also what starts the dispute window, so it must stay visible after cancelling
  const isReturnConfirmed = !!data?.returnVerifiedAt;
  const showReturnOtp =
    !!data?.returnOtp &&
    (data?.status === "in_progress" || (isEarlyReturn && !isReturnConfirmed));

  const isSettledBooking = data?.status === "completed" || isEarlyReturn;

  const damagedReport = data?.damagedReport;
  const showDamagedReport = isSettledBooking && !!damagedReport && data?.hasDamagedReport;

  const securityDeposit = Number(data?.priceDetails?.securityDeposit || 0);
  const showDepositOnHold =
    isEarlyReturn && data?.depositStatus === "held" && securityDeposit > 0;

  const disputeWindowEndsAt = data?.disputeWindowEndsAt
    ? new Date(data.disputeWindowEndsAt)
    : null;

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
                  <p className="text-gray-400 text-xs sm:text-sm mt-2">
                    {isEarlyReturn
                      ? "Hand the item back and share this code with the host. Your security deposit is released after they confirm."
                      : "Share this code with the host to confirm the return."}
                  </p>
                </div>
              )}

              {showDepositOnHold && (
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-[12px]">Security Deposit</h2>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex gap-3">
                    <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-amber-800">
                        ${securityDeposit.toFixed(2)} on hold
                      </p>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        {!isReturnConfirmed
                          ? "Return the item and share your Return OTP with the host. The dispute window starts once they confirm, and the deposit is released after it closes."
                          : disputeWindowEndsAt
                            ? `Returned automatically after ${disputeWindowEndsAt.toLocaleDateString()}, once the damage dispute window closes and no report has been raised.`
                            : "Returned automatically once the damage dispute window closes and no report has been raised."}
                      </p>
                    </div>
                  </div>
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
