"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const LogoutDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: LogoutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold">Confirm Logout</DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to log out? You will need to login again to access your account.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-3 sm:justify-start mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full bg-header hover:bg-teal-600 text-white rounded-full"
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};