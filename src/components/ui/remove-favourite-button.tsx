"use client";

import type React from "react";
import { X } from "lucide-react";
import { useToggleFavourite } from "@/hooks/useFavourite";
import { cn } from "@/lib/utils";

interface RemoveFavouriteButtonProps {
  listingId: string;
  className?: string;
}

export const RemoveFavouriteButton = ({ listingId, className }: RemoveFavouriteButtonProps) => {
  const toggleFavourite = useToggleFavourite();

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite.mutate(listingId);
  };

  return (
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
  );
};
