"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/components/common/loader";
import { useTranslations } from "next-intl";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  confirmDisabled?: boolean;
  variant?: "destructive" | "default" | "outline";
  children?: ReactNode;
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isLoading = false,
  confirmDisabled = false,
  variant = "default",
  children,
}: ConfirmDialogProps) => {
  const t = useTranslations("translation");
  const resolvedConfirmText = confirmText ?? t("confirm");
  const resolvedCancelText = cancelText ?? t("cancel");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left gap-1s">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {description}
          </DialogDescription>
          {children}
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-3 sm:justify-start mt-2">
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className="w-full h-10 rounded-full border-gray-300"
          >
            {resolvedCancelText}
          </Button>
          
          <Button
            onClick={onConfirm}
            disabled={isLoading || confirmDisabled}
            className={`w-full h-10 rounded-full text-white ${variant === "destructive"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-header hover:bg-aqua"
              }`}
          >
            {isLoading ? <Loader /> : resolvedConfirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
