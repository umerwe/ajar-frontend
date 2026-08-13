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
import { useTranslations } from "next-intl"
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

const actionTranslationKeys: Record<string, string> = {
  "Cancel Request": "cancelRequest",
  "Submit Pin": "submitPin",
  "Booking Cancelled": "bookingCancelled",
  "Extend Rental": "extendRental",
  "Rate Owner": "rateOwner",
  "Request Cancelled": "requestCancelled",
  "Rejected": "rejected",
  "Expired": "expired",
  "Unknown": "unknown",
};

const PricingActions = ({ property, bookingData, category_id, id }: any) => {
  const t = useTranslations("translation")
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
  const unitTranslationKeys: Record<string, { singular: string; plural: string }> = {
    day: { singular: "dayUnit", plural: "dayUnitPlural" },
    hour: { singular: "hourUnit", plural: "hourUnitPlural" },
    month: { singular: "monthUnit", plural: "monthUnitPlural" },
    year: { singular: "yearUnit", plural: "yearUnitPlural" },
  };
  const unitKey = unitTranslationKeys[unit as string];
  const durationUnit = unitKey ? t(duration > 1 ? unitKey.plural : unitKey.singular) : unit;

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
              title: t("paymentFailed"),
              description: t("paymentDetailsNotReceived"),
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
      title: t("cancelBookingRequestTitle"),
      description: t("cancelBookingRequestDescription"),
      confirmText: t("confirm"),
      showPolicy: false
    }
    : {
      title: t("cancelConfirmedBookingTitle"),
      description: t("cancelConfirmedBookingDescription"),
      confirmText: t("confirm"),
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
            {t("checkout")}
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
            {isStatusLoading ? <Loader /> : t("cancelRequest")}
          </Button>
        );

      case "Rate Owner":
        return (
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            {bookingData.isReviewSubmitted ? (
              <Button variant="destructive" className="px-7" disabled>
                {t("reviewSubmitted")}
              </Button>
            ) : (
              <Button onClick={() => setIsRateOpen(true)} variant="destructive" className="px-7">
                {t("rateOwner")}
              </Button>
            )}
          </div>
        );

      case "Extend Rental":
        return (
          <div className="flex flex-col gap-2">
            {isExtension && !isLastExtensionPending && (
              <Button
                onClick={() => setIsExtendOpen(true)}
                variant="destructive"
              >
                {t("extendRental")}
              </Button>
            )}
            <Button
              onClick={() => handleCancelConfirmOpenChange(true)}
              variant="destructive"
              disabled={isStatusLoading}
            >
              {isStatusLoading ? <Loader /> : t("cancelBooking")}
            </Button>
          </div>
        );

      case "Booking Cancelled":
        if (!refundRequest) {
          return (
            <Button
              onClick={() => router.push(`/refund?bookingId=${bookingData._id}`)}
              variant="destructive"
              className="w-full sm:w-auto px-7"
            >
              {t("requestRefund")}
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
              {t("refundInfo")}
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
              {t("submitPin")}
            </Button>
            <Button
              onClick={() => handleCancelConfirmOpenChange(true)}
              variant="destructive"
              disabled={isStatusLoading}
            >
              {isStatusLoading ? <Loader /> : t("cancelBooking")}
            </Button>
          </div>
        );

      default:
        return (
          <Link href={`/listing/${category_id}/${id}/${link}`}>
            <Button variant="destructive">
              {t(actionTranslationKeys[label] || "unknown")}
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
                  <span className="text-gray-800 text-lg">/{t("per")} {unit}</span>
                </h1>
              </div>
            </HoverCardTrigger>

            <HoverCardContent className="w-72 p-4" align="start">
              <div className="space-y-2">
                <h4 className="font-medium leading-none mb-3">{t("priceBreakdown")}</h4>

                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>{t("duration")}</span>
                  <span>{duration} {durationUnit}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t("subtotal")}</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>

                {
                  adminFee > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t("adminFee")}</span>
                      <span>${adminFee.toFixed(2)}</span>
                    </div>
                  )
                }

                {
                  tax > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t("tax")}</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  )
                }

                {extensionTotal > 0 && (
                  <div className="flex justify-between text-sm text-aqua font-medium">
                    <span>{t("extensionTotal")}</span>
                    <span>${extensionTotal.toFixed(2)}</span>
                  </div>
                )}

                {securityDeposit > 0 && (
                  <div className="flex justify-between text-sm text-aqua font-medium">
                    <span>{t("securityDeposit")}</span>
                    <span>${securityDeposit.toFixed(2)}</span>
                  </div>
                )}

                {additionalCharges > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t("extraCharges")}</span>
                    <span>${additionalCharges.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-base">
                  <span>{t("total")}</span>
                  <span>${displayTotal.toFixed(2)}</span>
                </div>
                {securityDeposit > 0 && (
                  <p className="text-[10px] text-gray-400 italic mt-1">* {t("includesRefundableDeposit")}</p>
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
                  <span className="text-gray-800 text-lg">/{t("per")} {bookingData ? bookingData?.pricingMeta?.unit : property.priceUnit}</span>
                </h1>
              </div>
            </HoverCardTrigger>

            <HoverCardContent className="w-72 p-4" align="start">
              <div className="space-y-2">
                <h4 className="font-medium leading-none mb-3">
                  {t("priceBreakdown")}
                </h4>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t("basePrice")}</span>
                  <span>${rawPrice.toFixed(2)}</span>
                </div>

                {
                  adminFeeNoBooking > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t("adminFee")}</span>
                      <span>${adminFeeNoBooking.toFixed(2)}</span>
                    </div>
                  )
                }

                {
                  taxNoBooking > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t("tax")}</span>
                      <span>${taxNoBooking.toFixed(2)}</span>
                    </div>
                  )
                }

                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>{t("total")}</span>
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
              {t("iAgreeToThe")}{" "}
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setIsPolicyOpen(true);
                }}
                className="font-medium text-aqua underline-offset-2 hover:underline"
              >
                {t("cancellationPolicy")}
              </button>
            </span>
          </label>
        )}
      </ConfirmDialog>

      <Dialog open={isPolicyOpen} onOpenChange={setIsPolicyOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("cancellationPolicy")}</DialogTitle>
            <DialogDescription>
              {t("reviewPolicyBeforeCancelling")}
            </DialogDescription>
          </DialogHeader>
          {cancellationPolicyContent ? (
            <div
              className="text-sm leading-7 text-gray-700 [&_strong]:font-semibold [&_strong]:text-gray-900"
              dangerouslySetInnerHTML={{ __html: cancellationPolicyContent }}
            />
          ) : (
            <p className="text-sm text-gray-500">{t("cancellationPolicyUnavailable")}</p>
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
