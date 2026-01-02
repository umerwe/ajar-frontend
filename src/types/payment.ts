export interface StripeCardFormProps {
  clientSecret: string
  amount: number
}

export interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientSecret: string | null
  amount: number
}