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
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import RefundStatusDialog from "@/components/dialogs/RefundStatusDialog"
import { toast } from "@/components/ui/toast"
import { useGetBusinessSettings } from "@/hooks/useBusinessSettings"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type BookingPaymentResponse = {
  clientSecret?: string;
  paymentIntentId?: string;
};

const getBookingPayment = (response: any): BookingPaymentResponse => {
  return response?.payment || response?.data?.payment || {};
};

const PricingActions = ({ property, bookingData, category_id, id }: any) => {
  const { mutate, isPending } = useSubmitPin();
  const { mutate: sendExtendRental, isPending: isExtendRentalPending } = useExtendRental();
  const { mutate: updateStatus, isPending: isStatusLoading } = useUpdateBookingStatus();
  const { data } = useUser();
  const { data: cancellationPolicyData } = useGetBusinessSettings("cancellationPolicy");
  
  const [isRateOpen, setIsRateOpen] = useState(false)
  const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);
  const [isInactiveOpen, setIsInactiveOpen] = useState(false);

  const [isPriceOpen, setIsPriceOpen] = useState(false)
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isCancellationPolicyAccepted, setIsCancellationPolicyAccepted] = useState(false);

  const router = useRouter()
  const { label, link } = getActionDetails(bookingData?.status);
  const [isRefundStatusOpen, setIsRefundStatusOpen] = useState(false);

  const rawPrice = property?.price || 0;
  const adminFeeNoBooking = property?.adminFee || 0;
  const taxNoBooking = property?.tax || 0;

  const totalNoBookingPrice =
    rawPrice + adminFeeNoBooking + taxNoBooking;
    
  const isExtension = bookingData?.rentalPolicySnapshot?.extensionAllowed;
  const pricingMeta = bookingData?.pricingMeta;

  const unitPrice = pricingMeta?.priceFromListing || property?.price || 0;
  const duration = pricingMeta?.duration || 0;
  const unit = pricingMeta?.unit || property?.priceUnit;

  const priceDetails = bookingData?.priceDetails || 0
  const basePrice = priceDetails?.price || property?.price || 0
  const adminFee = priceDetails?.adminFee || 0
  const tax = priceDetails?.tax || 0
  const additionalCharges = bookingData?.extraRequestCharges?.additionalCharges || 0;
  const securityDeposit = priceDetails?.securityDeposit || 0;
  const displayPrice = priceDetails?.totalPrice || basePrice;

  // ✅ Sum all extension totals
  const extensionTotal = (bookingData?.extensions || []).reduce(
    (sum: number, ext: any) => sum + (ext.priceDetails?.totalPrice || 0),
    0
  );

  const displayTotal = priceDetails?.totalPrice + extensionTotal + securityDeposit || 0;

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

  const handleExtensionSubmit = (date: string, amount: number) => {
    sendExtendRental({
      marketplaceListingId: bookingData.marketplaceListingId._id,
      extensionDate: date
    },
      {
        onSuccess: (response) => {
          const payment = getBookingPayment(response);

          if (!payment.clientSecret || !payment.paymentIntentId) {
            toast({
              title: "Payment Failed",
              description: "Payment details were not received. Please try again.",
              variant: "destructive",
            });
            return;
          }

          sessionStorage.setItem(
            "bookingPayment",
            JSON.stringify({
              clientSecret: payment.clientSecret,
              paymentIntentId: payment.paymentIntentId,
              amount,
              successRedirect: `/booking/details/${bookingData._id}`,
            })
          );
          setIsExtendOpen(false)
          router.push("/booking/payment");
        }
      }
    )
  }

  // Handler for dynamic cancellation
  const handleCancelBooking = () => {
    const targetStatus = bookingData.status === "pending" ? "request_cancelled" : "booking_cancelled";
    updateStatus(
      { bookingId: bookingData._id, status: targetStatus },
      { onSuccess: () => handleCancelConfirmOpenChange(false) }
    );
  }

  const handleCancelConfirmOpenChange = (open: boolean) => {
    setIsCancelConfirmOpen(open);

    if (!open) {
      setIsCancellationPolicyAccepted(false);
    }
  };

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

  const lastExtension = bookingData?.extensions?.length
    ? bookingData.extensions[bookingData.extensions.length - 1]
    : null;

  const lastExtensionStatus = lastExtension?.status;
  const isLastExtensionPending = lastExtensionStatus && lastExtensionStatus !== "approved";

  // AFTER
  const isHourlyUnit = bookingData?.pricingMeta?.unit === "hour"

  const minExtensionDate = lastExtension?.extensionDate
    ? isHourlyUnit
      ? new Date(lastExtension.extensionDate).toISOString()          // full ISO for hourly
      : new Date(lastExtension.extensionDate).toISOString().split("T")[0]  // date only for others
    : bookingData?.dates?.checkOut
      ? isHourlyUnit
        ? new Date(bookingData.dates.checkOut).toISOString()                // full ISO for hourly
        : new Date(bookingData.dates.checkOut).toISOString().split("T")[0]  // date only for others
      : undefined;

  // Configuration for dynamic dialog text
  const cancelConfig = bookingData?.status === "pending"
    ? {
      title: "Cancel Booking Request?",
      description: "This will cancel your current booking request. This action cannot be undone.",
      confirmText: "Confirm",
      showPolicy: false
    }
    : {
      title: "Cancel Confirmed Booking?",
      description: "This will cancel your active booking. You may be eligible for a refund based on the policy.",
      confirmText: "Confirm",
      showPolicy: true
    };

  const cancellationPolicyContent = cancellationPolicyData?.pageSettings?.content;

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
            onClick={() => handleCancelConfirmOpenChange(true)}
            variant="destructive"
            disabled={isStatusLoading}
          >
            {isStatusLoading ? <Loader /> : label}
          </Button>
        );

      case "Rate Owner":
        return (
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            {bookingData.isReviewSubmitted ? (
              <Button variant="destructive" className="px-7" disabled>
                Review Submitted
              </Button>
            ) : (
              <Button onClick={() => setIsRateOpen(true)} variant="destructive" className="px-7">
                {label}
              </Button>
            )}
          </div>
        );

      case "Extend Rental":
        return isExtension && !isLastExtensionPending ? (
          <Button
            onClick={() => setIsExtendOpen(true)}
            variant="destructive"
          >
            {label}
          </Button>
        ) : null;

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
              onClick={() => handleCancelConfirmOpenChange(true)}
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
                  <span>Subtotal</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>

                {
                  adminFee > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Admin Fee</span>
                      <span>${adminFee.toFixed(2)}</span>
                    </div>
                  )
                }

                {
                  tax > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  )
                }

                {extensionTotal > 0 && (
                  <div className="flex justify-between text-sm text-aqua font-medium">
                    <span>Extension Total</span>
                    <span>${extensionTotal.toFixed(2)}</span>
                  </div>
                )}

                {securityDeposit > 0 && (
                  <div className="flex justify-between text-sm text-aqua font-medium">
                    <span>Security Deposit</span>
                    <span>${securityDeposit.toFixed(2)}</span>
                  </div>
                )}

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
                {securityDeposit > 0 && (
                  <p className="text-[10px] text-gray-400 italic mt-1">* Includes refundable deposit</p>
                )}
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

                {
                  adminFeeNoBooking > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Admin Fee</span>
                      <span>${adminFeeNoBooking.toFixed(2)}</span>
                    </div>
                  )
                }

                {
                  taxNoBooking > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax</span>
                      <span>${taxNoBooking.toFixed(2)}</span>
                    </div>
                  )
                }

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
        onOpenChange={handleCancelConfirmOpenChange}
        onConfirm={handleCancelBooking}
        title={cancelConfig.title}
        description={cancelConfig.description}
        confirmText={cancelConfig.confirmText}
        variant="destructive"
        isLoading={isStatusLoading}
        confirmDisabled={cancelConfig.showPolicy && !isCancellationPolicyAccepted}
      >
        {cancelConfig.showPolicy && (
          <label className="mt-3 flex items-center gap-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
            <Checkbox
              checked={isCancellationPolicyAccepted}
              onCheckedChange={(checked) => setIsCancellationPolicyAccepted(checked === true)}
            />
            <span>
              I agree to the{" "}
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setIsPolicyOpen(true);
                }}
                className="font-medium text-aqua underline-offset-2 hover:underline"
              >
                Cancellation Policy
              </button>
            </span>
          </label>
        )}
      </ConfirmDialog>

      <Dialog open={isPolicyOpen} onOpenChange={setIsPolicyOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cancellation Policy</DialogTitle>
            <DialogDescription>
              Please review the policy before cancelling your booking.
            </DialogDescription>
          </DialogHeader>
          {cancellationPolicyContent ? (
            <div
              className="text-sm leading-7 text-gray-700 [&_strong]:font-semibold [&_strong]:text-gray-900"
              dangerouslySetInnerHTML={{ __html: cancellationPolicyContent }}
            />
          ) : (
            <p className="text-sm text-gray-500">Cancellation policy is not available right now.</p>
          )}
        </DialogContent>
      </Dialog>

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
        priceMeta={bookingData?.pricingMeta}
        pricingUnit={bookingData?.pricingMeta?.unit}
        dynamicPricing={bookingData?.marketplaceListingId?.dynamicPricing}
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
        booking={bookingData}
        refundNote={bookingData?.refundNote}
      />
    </div>
  )
}

export default PricingActions
