"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StripeCardForm } from "../forms/payment-form"
import { PaymentDialogProps } from "@/types/payment"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export const PaymentDialog = ({
  open,
  onOpenChange,
  clientSecret,
  amount
}: PaymentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeCardForm
              clientSecret={clientSecret}
              amount={amount}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  )
}