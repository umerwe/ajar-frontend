"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LogIn } from "lucide-react"
import { useRouter } from "next/navigation"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const LoginDialog = ({
  open,
  onOpenChange,
}: LoginDialogProps) => {
  const router = useRouter()

  const handleLoginRedirect = () => {
    router.push("/auth/login")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold">Login Required</DialogTitle>
          <DialogDescription className="text-gray-600">
            You need to login before this.
          </DialogDescription>
        </DialogHeader>

        {/* grid-cols-2 ensures equal width, sm:justify-start aligns them to the left */}
        <DialogFooter className="grid grid-cols-2 gap-3 sm:justify-start mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLoginRedirect}
            className="w-full bg-header hover:bg-teal-600 text-white rounded-full"
          >
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}