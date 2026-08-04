export interface StripeCardFormProps {
  clientSecret: string
  amount: number
  paymentIntentId?: string
  successRedirect?: string
}

export interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientSecret: string | null
  amount: number
}
