"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface NotFoundProps {
  type?: "favourite" | "filter" | "listing" | "listingData" | "chat" | "booking" | "bookingDetails" | "article";
}

const NotFound = ({ type = "listing" }: NotFoundProps) => {
  const t = useTranslations("translation");

  const titles: Record<string, string> = {
    favourite: t("noFavouritesFound"),
    filter: t("noResultsMatchFilters"),
    listing: t("noListingsFound"),
    listingData: t("listingNotFound"),
    booking: t("noBookingFound"),
    bookingDetails: t("bookingDetailsNotFound"),
    chat: t("noChatsFound"),
    article: t("noArticlesFound"),
  };

  const descriptions: Record<string, string> = {
    favourite: t("noFavouritesDescription"),
    filter: t("noFilterResultsDescription"),
    listing: t("noListingsDescription"),
    listingData: t("listingNotFoundDescription"),
    booking: t("noBookingDescription"),
    bookingDetails: t("bookingDetailsNotFoundDescription"),
    chat: t("noChatsDescription"),
    article: t("noArticlesDescription"),
  };

  const buttonLabels: Record<string, string> = {
    favourite: t("browseListings"),
    listing: t("backToHome"),
    chat: t("startChatting"),
  };

  const buttonLinks: Record<string, string> = {
    favourite: "/",
    listing: "/",
    chat: "/chat",
  };

  const title = titles[type] || t("noDataFound");
  const description = descriptions[type] || t("noDataFoundDescription");
  const showButton = type !== "filter";
  const buttonText = buttonLabels[type] || t("goHome");
  const buttonHref = buttonLinks[type] || "/";

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-250px)] lg:min-h-[calc(100vh-200px)]">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-gray-50 rounded-2xl shadow-sm border py-6 px-6">
          <div className="mb-4">
            <Search className="w-16 h-16 text-gray-300 mx-auto" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

          <p className="text-gray-600 mb-6">{description}</p>

          {showButton && (
            <Button asChild variant="destructive">
              <Link href={buttonHref}>{buttonText}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
