"use client";

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export const InactiveAccountDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-full bg-red-100">
              <AlertTriangle className="size-5 text-red-500" />
            </div>
            <DialogTitle className="text-lg">Account Inactive</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Your account is currently inactive because one or more of your
            documents have expired. Please update your documents to restore
            full access.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row justify-between gap-2 mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-44"
            onClick={() => {
              onOpenChange(false);
              router.push("/profile");
            }}
          >
            Update Documents
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};