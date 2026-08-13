"use client";

import type React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import { useToggleFavourite } from "@/hooks/useFavourite";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { useTranslations } from "next-intl";

interface RemoveFavouriteButtonProps {
  listingId: string;
  className?: string;
}

export const RemoveFavouriteButton = ({ listingId, className }: RemoveFavouriteButtonProps) => {
  const t = useTranslations("translation");
  const toggleFavourite = useToggleFavourite();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirmOpen(true);
  };

  const confirmRemove = () => {
    toggleFavourite.mutate(listingId, {
      onSuccess: () => setIsConfirmOpen(false),
    });
  };

  return (
    <>
      <button
        onClick={handleRemove}
        disabled={toggleFavourite.isPending}
        className={cn(
          "absolute top-0 right-0 z-10",
          "bg-red-500 backdrop-blur-sm hover:bg-red-600",
          "p-1.5 rounded-full transition-all duration-200",
          "text-white shadow-sm",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
      >
        <X className="w-3 h-3" />
      </button>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={confirmRemove}
        title={t("removeFavourite")}
        description={t("removeFavouriteConfirmation")}
        confirmText={t("remove")}
        isLoading={toggleFavourite.isPending}
        variant="destructive"
      />
    </>
  );
};
