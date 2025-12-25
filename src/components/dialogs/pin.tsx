import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Loader from "../common/loader"

export const PinDialog = ({ open, onOpenChange, onSubmit, amount, isPending }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSubmit: (pin: string) => void,
  amount: number
  isPending?: boolean
}) => {
  const [pin, setPin] = useState("")

  const handleSubmit = () => {
    onSubmit(pin)
    setPin("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter PIN for Payment</DialogTitle>
          <DialogDescription>
            Enter the PIN sent to leaser email to authorize the payment of ${Math.round(amount)}.00.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pin" className="text-left">
              PIN/OTP
            </Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 4 digit pin"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={pin.length < 4 || isPending}
            className="bg-header hover:bg-header/90 text-white"
          >
            {
              isPending ? <Loader /> : "Submit"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
