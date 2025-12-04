"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotFoundProps {
  type?: "favourite" | "filter" | "listing" | "chat" | string;
}

const NotFound = ({ type = "listing" }: NotFoundProps) => {
  // Dynamic titles
  const titles: Record<string, string> = {
    favourite: "No Favourites Found",
    filter: "No Results Match Your Filters",
    listing: "No Listings Found",
    chat: "No Chats Found",
  };

  // Dynamic descriptions
  const descriptions: Record<string, string> = {
    favourite: "You haven't added any listings to your favourites yet.",
    filter: "Try adjusting your filters to find better results.",
    listing: "There are no listings available right now. Please check again later.",
    chat: "You have no conversations yet.",
  };

  // Dynamic button labels
  const buttonLabels: Record<string, string> = {
    favourite: "Browse Listings",
    listing: "Back to Home",
    chat: "Start Chatting",
  };

  // Dynamic button links
  const buttonLinks: Record<string, string> = {
    favourite: "/",
    listing: "/",
    chat: "/chat",
  };

  const title = titles[type || ""] || "No Data Found";
  const description =
    descriptions[type || ""] ||
    "We couldn’t find any data. Please try again later.";

  const showButton = type !== "filter"; // filter should hide button

  const buttonText = buttonLabels[type || ""] || "Go Home";
  const buttonHref = buttonLinks[type || ""] || "/";

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-70px)]">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-gray-50 rounded-2xl shadow-sm border py-6 px-6">
          <div className="mb-4">
            <Search className="w-16 h-16 text-gray-300 mx-auto" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>

          <p className="text-gray-600 mb-6">
            {description}
          </p>

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
