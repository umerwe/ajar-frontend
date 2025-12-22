"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Calendar, Users, BedDouble } from "lucide-react" // Added icons
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
  dates?: {
    checkIn: string
    checkOut: string
  }
}

const CardBottom = ({ property, bookingId, totalPrice, isApproved, dates }: CardBottomProps) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "--"
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
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

  const buttonStyles = "px-2 h-7 min-[500px]:h-8 min-[500px]:px-3 text-[10px] sm:text-xs"

  return (
    <>
      <CardFooter className="pb-2 pt-0 flex justify-between items-center mt-auto w-full">
        <div className="flex flex-col">
          <span className="text-xs min-[500px]:text-sm 2xl:text-base font-semibold text-gray-900 tracking-tight truncate leading-tight">
            ${(totalPrice ? totalPrice : property.price).toFixed(2)}/
          </span>
          <span className="text-[10px] sm:text-xs text-gray-custom font-medium leading-none">{property?.priceUnit}</span>
        </div>

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
          !dates ?
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
              <Button
                variant="outline"
                className={buttonStyles}
              >
                View Details
              </Button>
            </Link>
            :
            null
        )}
      </CardFooter>

      {
        dates &&
        <div className="pb-2 flex flex-col gap-3">
          <div className="flex items-center text-[12px]">
            <Calendar className="w-4 h-4 mr-1 text-[#8fa3bf]" strokeWidth={1.5} />
            <span className="text-[#90A3BF] mr-2">Dates:</span>
            <span className="text-[#858585] truncate">
              {formatDate(dates?.checkIn)} - {formatDate(dates?.checkOut)}
            </span>
          </div>
        </div>
      }


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