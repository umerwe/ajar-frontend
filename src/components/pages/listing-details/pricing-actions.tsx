"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "@/components/ui/toast"
import { RatingDialog } from "../../dialogs/rating"
import { getActionDetails } from "@/lib/getAction"
import api from "@/lib/axios"
import { PaymentDialog } from "@/components/dialogs/payment"
import { PinDialog } from "@/components/dialogs/pin"
import { useExtendRental, useSubmitPin, useUpdateBookingStatus } from "@/hooks/useBooking"
import { ExtensionDialog } from "@/components/dialogs/extenstion"
import { useUser } from "@/hooks/useAuth"
import Loader from "@/components/common/loader"
import Document from "./document"
import { useDeductWallet } from "@/hooks/useWallet"

const PricingActions = ({ property, bookingData, category_id, id }: any) => {
  const { mutate, isPending } = useSubmitPin();
  console.log(property)
  const { mutate: sendExtendRental, isPending: isExtendRentalPending } = useExtendRental();
  const { mutate: updateStatus, isPending: isStatusLoading } = useUpdateBookingStatus();
  const { mutate: deductWallet, isPending: isDeductPending } = useDeductWallet();
  const { data } = useUser();
  const [isRateOpen, setIsRateOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const [isPriceOpen, setIsPriceOpen] = useState(false)
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isExtendOpen, setIsExtendOpen] = useState(false);

  const router = useRouter()
  const { label, link } = getActionDetails(bookingData?.status);

  // Price when NO booking exists (use property data)
  const rawPrice = property?.price || 0;
  const adminFeeNoBooking = property?.adminFee || 0;
  const taxNoBooking = property?.tax || 0;

  const totalNoBookingPrice =
    rawPrice + adminFeeNoBooking + taxNoBooking;


  // Price Calculation
  const priceDetails = bookingData?.priceDetails
  const basePrice = priceDetails?.price || property?.price || 0
  const adminFee = priceDetails?.adminFee || 0
  const tax = priceDetails?.tax || 0
  const additionalCharges = bookingData?.extraRequestCharges?.additionalCharges || 0
  const displayPrice = priceDetails?.totalPrice || basePrice

  const handlePaymentClick = async () => {
    if (!bookingData?._id) return

    deductWallet({
      amount: displayPrice,
      description: "Booking payment",
      bookingId: bookingData._id
    },
      {
        onSuccess: () => {
          router.replace(`/success/${bookingData._id}`)
        }
      })
    // setLoadingPayment(true)
    // try {
    //   const response = await api.post("/api/payments/stripe/intent", {
    //     bookingId: bookingData._id,
    //   })
    //   const secret = response.data?.clientSecret

    //   if (secret) {
    //     setClientSecret(secret)
    //     setIsPaymentOpen(true)
    //   }
    // } catch {
    //   toast({ description: "Failed to initialize payment.", variant: "destructive" })
    // } finally {
    //   setLoadingPayment(false)
    // }
  }

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

  const minExtensionDate = bookingData?.dates?.checkOut
    ? new Date(bookingData.dates.checkOut).toISOString().split("T")[0]
    : undefined;

  const renderActionButton = () => {
    if (!bookingData) {
      if (data._id !== property.leaser._id) {
        return (
          <Button
            onClick={() => router.push(`/listing/${category_id}/${id}/checkout`)}
            variant="destructive"
          >
            Checkout
          </Button>
        );
      }
      return <Document property={property} />
    }

    if (label === "Cancelled" || label === "Rejected") {
      return null;
    }

    switch (label) {
      case "Cancel Request":
        return (
          <Button
            onClick={() => updateStatus({ bookingId: bookingData._id })}
            variant="destructive"
            disabled={isStatusLoading}
          >
            {isStatusLoading ? <Loader /> : label}
          </Button>
        );

      case "Rate Owner":
        return (
          <Button onClick={() => setIsRateOpen(true)} variant="destructive" className="w-full sm:w-auto px-7">
            {label}
          </Button>
        );

      case "Extend Rental":
        return (
          <Button onClick={() => setIsExtendOpen(true)} variant="destructive">
            {label}
          </Button>
        );

      case "Proceed to pay":
        return (
          <Button
            onClick={() => setIsPinOpen(true)}
            disabled={loadingPayment}
            variant="destructive"
          >
            {loadingPayment ? (
              <Loader />
            ) : (
              "Submit Pin"
            )}
          </Button>
        );
      // // if (bookingData.paymentStatus === "succeeded") {

      // // } 
      // // else {
      // //   return (
      // //     <Button
      // //       onClick={handlePaymentClick}
      // //       disabled={isDeductPending}
      // //       variant="destructive"
      // //     >
      // //       {isDeductPending ? (
      // //         <Loader />
      // //       ) : (
      // //         label === "Approved" ? "Pay Now" : label
      // //       )}
      // //     </Button>
      // //   );
      // }

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
                <span className="text-xl sm:text-2xl font-semibold border-b border-dotted border-gray-400 pb-1 group-hover:border-gray-800 transition-colors">
                  ${displayPrice.toFixed(2)}
                </span>
                <Info className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </HoverCardTrigger>

            <HoverCardContent className="w-72 p-4" align="start">
              <div className="space-y-2">
                <h4 className="font-medium leading-none mb-3">Price Breakdown</h4>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Base Price</span>
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

                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${displayPrice.toFixed(2)}</span>
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
                <span className="text-xl sm:text-2xl font-semibold border-b border-dotted border-gray-400 pb-1 group-hover:border-gray-800 transition-colors">
                  ${totalNoBookingPrice.toFixed(2)}
                </span>
                <Info className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
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

      <RatingDialog
        open={isRateOpen}
        onClose={() => setIsRateOpen(false)}
        bookingId={bookingData?._id as string}
      />

      <PaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        clientSecret={clientSecret}
        bookingId={bookingData?._id as string}
        amount={displayPrice}
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
      />

    </div>
  )
}

export default PricingActions