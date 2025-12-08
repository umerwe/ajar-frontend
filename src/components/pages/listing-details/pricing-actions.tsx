"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Info, Loader2, Lock, CreditCard } from "lucide-react" 
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"

import { RatingDialog } from "./rating-dialog"
import { getActionDetails } from "@/lib/actions/getAction"
import api from "@/lib/axios"

// Types
import { Listing } from "@/types/listing"
import { Booking } from "@/types/booking"
import Loader from "@/components/common/loader"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

interface PricingActionsProps {
  property?: Listing
  bookingData?: Booking
  category_id: string
  id: string
}

// --- UPDATED STRIPE FORM ---
const StripeCardForm = ({ 
  clientSecret, 
  bookingId, 
  amount 
}: { 
  clientSecret: string; 
  bookingId: string; 
  amount: number; 
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  
  // State for billing fields
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")

  // Styling consistent with your "ChatGPT-style" request
  const inputBaseClasses = "block w-full rounded-md border-transparent bg-gray-100 px-4 py-3 text-sm transition-all focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-300 focus:outline-none"
  
  const stripeElementOptions = {
    style: {
      base: {
        fontSize: "14px",
        color: "#1f2937",
        fontFamily: 'inherit',
        "::placeholder": {
          color: "#6b7280",
        },
      },
      invalid: {
        color: "#ef4444",
      },
    },
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return
    setIsLoading(true)

    const cardElement = elements.getElement(CardNumberElement)

    if (!cardElement) {
      setIsLoading(false)
      return
    }
    
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: name,
          address: {
            line1: address,
            country: 'PK', 
          }
        },
      },
    })

    if (error) {
      toast({
        description: error.message || "Payment failed.",
        variant: "destructive",
      })
      setIsLoading(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      window.location.href = `/success?bookingId=${bookingId}`
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-2">
      
      {/* --- Payment Method Section --- */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base">Payment method</h3>
        
        {/* Card Number */}
        <div className={inputBaseClasses}>
            <CardNumberElement options={{...stripeElementOptions, showIcon: true}} className="w-full" />
        </div>

        {/* Expiry & CVC Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className={inputBaseClasses}>
            <CardExpiryElement options={stripeElementOptions} />
          </div>
          <div className={`${inputBaseClasses} flex items-center gap-2`}>
            <CardCvcElement options={stripeElementOptions} className="w-full" />
            <CreditCard className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* --- Billing Address Section --- */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base">Billing address</h3>
        
        <input 
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputBaseClasses}
        />

        <div className="relative">
          <select 
            className={`${inputBaseClasses} appearance-none`} 
            defaultValue="PK"
          >
            <option value="PK">Pakistan</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <input 
          required
          placeholder="Address line 1"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={inputBaseClasses}
        />
      </div>

      {/* --- Submit Button --- */}
      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full py-6 text-lg transition-colors mt-2"
        variant="destructive"
      >
        {isLoading ? (
          <>
            <Loader />
          </>
        ) : (
          `Pay $${Math.round(amount)}.00`
        )}
      </Button>
      
      <div className="flex justify-center items-center gap-2 text-xs text-muted-foreground mt-4">
        <Lock className="h-3 w-3" />
        <span>Payments are secure and encrypted</span>
      </div>
    </form>
  )
}

// --- MAIN COMPONENT ---
const PricingActions = ({ property, bookingData, category_id, id }: PricingActionsProps) => {
  const [isRateOpen, setIsRateOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  
  // New state to control HoverCard via click as well
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
    } catch{
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
          {/* Added open and onOpenChange to control state manually */}
          <HoverCard open={isPriceOpen} onOpenChange={setIsPriceOpen}>
            <HoverCardTrigger asChild>
              {/* Added onClick to toggle state for mobile support */}
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

      {/* --- STRIPE DIALOG --- */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>

          {clientSecret && bookingData?._id && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripeCardForm 
                clientSecret={clientSecret} 
                bookingId={bookingData._id} 
                amount={displayPrice} 
              />
            </Elements>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default PricingActions