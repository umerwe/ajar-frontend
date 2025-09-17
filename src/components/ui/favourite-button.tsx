"use client";

import { Heart } from "lucide-react";
import { useToggleFavourite, useIsFavourite } from "@/hooks/useFavourite";
import { cn } from "@/lib/utils";

interface FavouriteButtonProps {
  listingId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "card" | "minimal";
}

export const FavouriteButton = ({
  listingId,
  className,
  size = "md",
  variant = "default",
}: FavouriteButtonProps) => {
  const toggleFavourite = useToggleFavourite();
  
  const isFavourite = useIsFavourite(listingId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite.mutate(listingId);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={toggleFavourite.isPending}
      className={cn(
        "flex items-center justify-center rounded-full transition duration-200 group disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" && "p-1.5 w-7 h-7",
        size === "md" && "p-2 w-9 h-9",
        size === "lg" && "p-3 w-12 h-12",
        variant === "default" &&
          "bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm",
        variant === "card" &&
          "bg-white/90 backdrop-blur-sm hover:bg-white",
        variant === "minimal" &&
          "bg-transparent hover:bg-white/20",
        className
      )}
    >
      <Heart
        className={cn(
          "transition-colors duration-200",
          size === "sm" && "w-3 h-3",
          size === "md" && "w-4 h-4",
          size === "lg" && "w-5 h-5",
          isFavourite
            ? "text-red-500 fill-red-500"
            : "text-gray-600 group-hover:text-red-500"
        )}
      />
    </button>
  );
};
