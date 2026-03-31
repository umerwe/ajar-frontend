"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { RatingDialog } from "../../dialogs/rating"
import { getActionDetails } from "@/lib/getAction"
import { PinDialog } from "@/components/dialogs/pin"
import { useExtendRental, useSubmitPin, useUpdateBookingStatus } from "@/hooks/useBooking"
import { ExtensionDialog } from "@/components/dialogs/extenstion"
import { useUser } from "@/hooks/useAuth"
import Loader from "@/components/common/loader"
import Document from "./document"
import { LoginDialog } from "@/components/dialogs/login-dialog"
import { InactiveAccountDialog } from "@/components/dialogs/inactiveAccountDialog"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog" // Added
import RefundStatusDialog from "@/components/dialogs/RefundStatusDialog"

const PricingActions = ({ property, bookingData, category_id, id }: any) => {
  const { mutate, isPending } = useSubmitPin();
  const { mutate: sendExtendRental, isPending: isExtendRentalPending } = useExtendRental();
  const { mutate: updateStatus, isPending: isStatusLoading } = useUpdateBookingStatus();
  const { data } = useUser();

  const [isRateOpen, setIsRateOpen] = useState(false)
  const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);
  const [isInactiveOpen, setIsInactiveOpen] = useState(false);

  const [isPriceOpen, setIsPriceOpen] = useState(false)
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const router = useRouter()
  const { label, link } = getActionDetails(bookingData?.status);
  const [isRefundStatusOpen, setIsRefundStatusOpen] = useState(false);

  const rawPrice = property?.price || 0;
  const adminFeeNoBooking = property?.adminFee || 0;
  const taxNoBooking = property?.tax || 0;

  const totalNoBookingPrice =
    rawPrice + adminFeeNoBooking + taxNoBooking;

  const pricingMeta = bookingData?.pricingMeta;

  const unitPrice = pricingMeta?.priceFromListing || property?.price || 0;
  const duration = pricingMeta?.duration || 0;
  const unit = pricingMeta?.unit || property?.priceUnit;

  const priceDetails = bookingData?.priceDetails || 0
  const basePrice = priceDetails?.price || property?.price || 0
  const adminFee = priceDetails?.adminFee || 0
  const tax = priceDetails?.tax || 0
  const additionalCharges = bookingData?.extraRequestCharges?.additionalCharges || 0
  const displayPrice = priceDetails?.totalPrice || basePrice;
  const displayTotal = priceDetails?.totalPrice || 0;

  const refundRequest = bookingData?.refundRequest;

  const handlePinSubmit = (pin: string) => {
    mutate({ bookingId: bookingData._id, otp: pin },
      {
        onSuccess: () => {
          setIsPinOpen(false)
        }
      }
    )
  }

  const handleExtensionSubmit = (date: string) => {
    sendExtendRental({
      marketplaceListingId: bookingData.marketplaceListingId._id,
      extensionDate: date
    },
      {
        onSuccess: () => {
          setIsExtendOpen(false)
        }
      }
    )
  }

  // Handler for dynamic cancellation
  const handleCancelBooking = () => {
    const targetStatus = bookingData.status === "pending" ? "request_cancelled" : "booking_cancelled";
    updateStatus(
      { bookingId: bookingData._id, status: targetStatus },
      { onSuccess: () => setIsCancelConfirmOpen(false) }
    );
  }

  const handleProtectedAction = () => {
    if (!data?.name) {
      setIsGuestDialogOpen(true);
      return;
    }

    if (data?.status === "inactive") {
      setIsInactiveOpen(true);
      return;
    }

    router.push(`/listing/${category_id}/${id}/checkout`)
  };

  const minExtensionDate = bookingData?.dates?.checkOut
    ? new Date(bookingData.dates.checkOut).toISOString().split("T")[0]
    : undefined;

  // Configuration for dynamic dialog text
  const cancelConfig = bookingData?.status === "pending"
    ? {
      title: "Cancel Booking Request?",
      description: "This will cancel your current booking request. This action cannot be undone.",
      confirmText: "Confirm"
    }
    : {
      title: "Cancel Confirmed Booking?",
      description: "This will cancel your active booking. You may be eligible for a refund based on the policy.",
      confirmText: "Confirm"
    };

  const renderActionButton = () => {
    if (!bookingData) {
      if (data?._id !== property.leaser._id) {
        return (
          <Button
            onClick={handleProtectedAction}
            variant="destructive"
          >
            Checkout
          </Button>
        );
      }
      return <Document property={property} />
    }

    if (label === "Request Cancelled" || label === "Rejected" || label === "Expired") {
      return null;
    }

    switch (label) {
      case "Cancel Request":
        return (
          <Button
            onClick={() => setIsCancelConfirmOpen(true)}
            variant="destructive"
            disabled={isStatusLoading}
          >
            {isStatusLoading ? <Loader /> : label}
          </Button>
        );

      case "Rate Owner":
        return (
          bookingData.isReviewSubmitted ?
            <Button variant="destructive" className="w-full sm:w-auto px-7">
              Review Submitted
            </Button> :
            <Button onClick={() => setIsRateOpen(true)} variant="destructive" className="w-full sm:w-auto px-7">
              {label}
            </Button>
        );

      case "Extend Rental":
        return bookingData?.isExtend ?
          null
          : (
            <Button
              onClick={() => setIsExtendOpen(true)}
              variant="destructive"
            >
              {label}
            </Button>
          )
          ;

      case "Booking Cancelled":
        if (!refundRequest) {
          return (
            <Button
              onClick={() => router.push(`/refund?bookingId=${bookingData._id}`)}
              variant="destructive"
              className="w-full sm:w-auto px-7"
            >
              Request Refund
            </Button>
          );
        }
        return (
          <>
            <Button
              onClick={() => setIsRefundStatusOpen(true)}
              variant="destructive"
              className="w-full sm:w-auto px-7"
            >
              Refund Info
            </Button>
          </>
        );

      case "Submit Pin":
        return (
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setIsPinOpen(true)}
              variant="destructive"
            >
              Submit Pin
            </Button>
            <Button
              onClick={() => setIsCancelConfirmOpen(true)} // Trigger Dialog
              variant="destructive"
              disabled={isStatusLoading}
            >
              {isStatusLoading ? <Loader /> : "Cancel Booking"}
            </Button>
          </div>
        );

      default:
        return (
          <Link href={`/listing/${category_id}/${id}/${link}`}>
            <Button variant="destructive">
              {label}
            </Button>
          </Link>
        );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between items-start sm:items-center md:items-start lg:items-center gap-3 md:gap-4">
      {bookingData ? (
        <div className="flex flex-col gap-1">
          <HoverCard open={isPriceOpen} onOpenChange={setIsPriceOpen}>
            <HoverCardTrigger asChild>
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setIsPriceOpen(!isPriceOpen)}
              >
                <h1 className="text-xl sm:text-2xl border-b border-dotted border-gray-400 pb-1 group-hover:border-gray-800 transition-colors">
                  <span className="font-semibold">${unitPrice.toFixed(2)} </span>
                  <span className="text-gray-800 text-lg">/per {unit}</span>
                </h1>
              </div>
            </HoverCardTrigger>

            <HoverCardContent className="w-72 p-4" align="start">
              <div className="space-y-2">
                <h4 className="font-medium leading-none mb-3">Price Breakdown</h4>

                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Duration</span>
                  <span>{duration} {unit}{duration > 1 ? 's' : ''}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal ({duration} × ${unitPrice.toFixed(2)})</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Admin Fee</span>
                  <span>${adminFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                {additionalCharges > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Extra Charges</span>
                    <span>${additionalCharges.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${displayTotal.toFixed(2)}</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <HoverCard open={isPriceOpen} onOpenChange={setIsPriceOpen}>
            <HoverCardTrigger asChild>
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setIsPriceOpen(!isPriceOpen)}
              >
                <h1 className="text-xl sm:text-2xl border-b border-dotted border-gray-400 pb-1 group-hover:border-gray-800 transition-colors">
                  <span className="font-semibold">${rawPrice.toFixed(2)} </span>
                  <span className="text-gray-800 text-lg">/per {bookingData ? bookingData?.pricingMeta?.unit : property.priceUnit}</span>
                </h1>
              </div>
            </HoverCardTrigger>

            <HoverCardContent className="w-72 p-4" align="start">
              <div className="space-y-2">
                <h4 className="font-medium leading-none mb-3">
                  Price Breakdown
                </h4>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Base Price</span>
                  <span>${rawPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Admin Fee</span>
                  <span>${adminFeeNoBooking.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax</span>
                  <span>${taxNoBooking.toFixed(2)}</span>
                </div>

                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalNoBookingPrice.toFixed(2)}</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      )}

      {renderActionButton()}

      {/* Confirmation Dialog Integration */}
      <ConfirmDialog
        open={isCancelConfirmOpen}
        onOpenChange={setIsCancelConfirmOpen}
        onConfirm={handleCancelBooking}
        title={cancelConfig.title}
        description={cancelConfig.description}
        confirmText={cancelConfig.confirmText}
        variant="destructive"
        isLoading={isStatusLoading}
      />

      <RatingDialog
        open={isRateOpen}
        onClose={() => setIsRateOpen(false)}
        bookingId={bookingData?._id as string}
      />

      <PinDialog
        open={isPinOpen}
        isPending={isPending}
        onOpenChange={setIsPinOpen}
        onSubmit={handlePinSubmit}
        amount={displayPrice}
      />

      <ExtensionDialog
        open={isExtendOpen}
        onOpenChange={setIsExtendOpen}
        onSubmit={handleExtensionSubmit}
        minDate={minExtensionDate}
        isPending={isExtendRentalPending}
        pricingUnit={bookingData?.pricingMeta?.unit}
      />

      <LoginDialog
        open={isGuestDialogOpen}
        onOpenChange={setIsGuestDialogOpen}
      />

      <InactiveAccountDialog
        open={isInactiveOpen}
        onOpenChange={setIsInactiveOpen}
      />

      <RefundStatusDialog
        isOpen={isRefundStatusOpen}
        onOpenChange={setIsRefundStatusOpen}
        refundRequest={refundRequest}
        refundNote={bookingData?.refundNote}
      />
    </div>
  )
}

export default PricingActions