"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { toast } from "@/components/ui/toast"

import api from "@/lib/axios"
import { Listing } from "@/types/listing"
import { PaymentDialog } from "../dialogs/payment"

interface CardBottomProps {
  property: Listing
  bookingId?: string
  totalPrice?: number
  isApproved?: boolean
}

const CardBottom = ({ property, bookingId, totalPrice, isApproved }: CardBottomProps) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePayClick = async () => {
    if (!bookingId) return

    setLoadingPayment(true)
    try {
      const response = await api.post("/api/payments/stripe/intent", {
        bookingId: bookingId,
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

  const buttonStyles = "px-2.5 h-7 min-[500px]:h-8 min-[500px]:px-3 text-[11px] sm:text-xs"

  return (
    <>
      <CardFooter className="pb-4 pt-0 flex justify-between items-center mt-auto w-full">

        {/* Price Section */}
        <div className="flex flex-col">
          <span className="text-sm min-[500px]:text-sm 2xl:text-base font-bold text-gray-900 tracking-tight leading-tight">
            ${Math.round(totalPrice ? totalPrice : property.price)}
            <span className="hidden sm:inline">.00</span>/
          </span>
          <span className="text-[10px] sm:text-xs text-gray-custom font-medium leading-none">day</span>
        </div>

        {/* Button Section */}
        {isApproved ? (
          <Button
            variant="outline"
            className={buttonStyles}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePayClick();
            }}
            disabled={loadingPayment}
          >
            {loadingPayment ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "Pay Now"
            )}
          </Button>
        ) : (
          <Link
            href={
              bookingId
                ? `/booking/details/${bookingId}`
                : `/listing/${property.subCategory?._id}/${property._id}`
            }
            onClick={(e) => {
              e.stopPropagation();
              scrollToTop();
            }}
          >
            <Button variant="outline" className={buttonStyles}>
              View Details
            </Button>
          </Link>
        )}
      </CardFooter>

      <div onClick={(e) => e.stopPropagation()}>
        <PaymentDialog
          open={isPaymentOpen}
          onOpenChange={setIsPaymentOpen}
          clientSecret={clientSecret}
          bookingId={bookingId || ""}
          amount={totalPrice || property.price}
        />
      </div>
    </>
  )
}

export default CardBottom