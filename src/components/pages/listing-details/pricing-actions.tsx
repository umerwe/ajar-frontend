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
} from "@/components/ui/hover-card"
import { toast } from "@/components/ui/toast"
import { RatingDialog } from "../../dialogs/rating"
import { getActionDetails } from "@/lib/actions/getAction"
import api from "@/lib/axios"
import { PaymentDialog } from "@/components/dialogs/payment"

const PricingActions = ({ property, bookingData, category_id, id }: PricingActionsProps) => {
  const [isRateOpen, setIsRateOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const [isPriceOpen, setIsPriceOpen] = useState(false)

  const router = useRouter()
  const { label, link } = getActionDetails(bookingData?.status)

  // Price Calculation
  const priceDetails = bookingData?.priceDetails
  const basePrice = priceDetails?.price || property?.price || 0
  const adminFee = priceDetails?.adminFee || 0
  const tax = priceDetails?.tax || 0
  const additionalCharges = bookingData?.extraRequestCharges?.additionalCharges || 0
  const displayPrice = priceDetails?.totalPrice || basePrice

  const handlePaymentClick = async () => {
    if (!bookingData?._id) return
    setLoadingPayment(true)
    try {
      const response = await api.post("/api/payments/stripe/intent", {
        bookingId: bookingData._id,
      })
      const secret = response.data?.clientSecret

      if (secret) {
        setClientSecret(secret)
        setIsPaymentOpen(true)
      }
    } catch {
      toast({ description: "Failed to initialize payment.", variant: "destructive" })
    } finally {
      setLoadingPayment(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between items-start sm:items-center md:items-start lg:items-center gap-3 md:gap-4">

      {/* --- Price Display --- */}
      {bookingData ? (
        <div className="flex flex-col gap-1">
          <HoverCard open={isPriceOpen} onOpenChange={setIsPriceOpen}>
            <HoverCardTrigger asChild>
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setIsPriceOpen(!isPriceOpen)}
              >
                <span className="text-xl sm:text-2xl font-semibold border-b border-dotted border-gray-400 pb-1 group-hover:border-gray-800 transition-colors">
                  ${Math.round(displayPrice)}.00
                </span>
                <Info className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-72 p-4" align="start">
              <div className="space-y-2">
                <h4 className="font-medium leading-none mb-3">Price Breakdown</h4>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Base Price</span><span>${Math.round(basePrice)}.00</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Admin Fee</span><span>${Math.round(adminFee)}.00</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax</span><span>${Math.round(tax)}.00</span>
                </div>
                {additionalCharges > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Extra Charges</span><span>${Math.round(additionalCharges)}.00</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span><span>${Math.round(displayPrice)}.00</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="text-xl sm:text-2xl font-semibold border-b border-dotted border-gray-400 pb-1">
            ${Math.round(property?.price as number || 0)}.00
          </span>
        </div>
      )}

      {/* --- Buttons --- */}
      {bookingData ? (
        label === "Rate Owner" ? (
          <Button onClick={() => setIsRateOpen(true)} variant="destructive" className="w-full sm:w-auto px-7">{label}</Button>
        ) : (label === "Proceed to pay" || label === "Approved") ? (
          <Button onClick={handlePaymentClick} disabled={loadingPayment} variant="destructive" className="w-full sm:w-auto px-7">
            {loadingPayment ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : (label === "Approved" ? "Pay Now" : label)}
          </Button>
        ) : (
          <Link href={`/listing/${category_id}/${id}/${link}`}>
            <Button variant="destructive" className="w-full sm:w-auto px-7">{label}</Button>
          </Link>
        )
      ) : (
        <Button onClick={() => router.push(`/listing/${category_id}/${id}/checkout`)} variant="destructive" className="w-full sm:w-auto px-7">
          Checkout
        </Button>
      )}

      <RatingDialog open={isRateOpen} onClose={() => setIsRateOpen(false)} bookingId={bookingData?._id as string} />

      <PaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        clientSecret={clientSecret}
        bookingId={bookingData?._id as string}
        amount={displayPrice}
      />

    </div>
  )
}

export default PricingActions