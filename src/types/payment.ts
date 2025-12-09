export interface StripeCardFormProps {
  clientSecret: string
  bookingId: string
  amount: number
}

export interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientSecret: string | null
  bookingId: string
  amount: number
}