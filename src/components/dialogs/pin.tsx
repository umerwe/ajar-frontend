import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Input from "@/components/ui/auth-input"
import { Label } from "@/components/ui/label"
import Loader from "../common/loader"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { pinSchema, PinFormValues } from "@/validations/pin"

export const PinDialog = ({
  open,
  onOpenChange,
  onSubmit,
  amount,
  isPending,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (pin: string) => void
  amount: number
  isPending?: boolean
}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<PinFormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: "" },
  })

  const submitHandler = (data: PinFormValues) => {
    onSubmit(data.pin);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter PIN for Payment</DialogTitle>
          <DialogDescription>
            Enter the PIN sent to leaser email to authorize the payment of $
            {Math.round(amount)}.00.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pin">PIN / OTP</Label>

              <Input
                id="pin"
                type="password" 
                placeholder="Enter 4 digit PIN"
                maxLength={4}
                register={register("pin")}
                error={errors.pin?.message}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-header hover:bg-header/90 text-white"
            >
              {isPending ? <Loader /> : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
