"use client";

import Image from "@/components/MyImage";
import { useState } from "react";
import { Listing } from "@/types/listing";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import CoreDetails from "./core-details";
import Rating from "./rating";
import { removeFields } from "@/utils/removeFields"

interface PropertyHeaderProps {
  property: Listing;
}

const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const cleanedData = removeFields(property as any, [
    "_id", "leaser", "subCategory", "zone", "ratings", "name", "subTitle",
    "images", "rentalImages", "description", "price", "isActive", "language",
    "documents", "isAvailable", "currentBookingId", "status", "priceUnit",
    "createdAt", "updatedAt", "__v", "userDocuments", "leaserDocuments",
    "adminFee", "tax", "languages", "averageRating", "totalReviews", "rejectionNote","location", "refundNote", "refundNote", "bookings", "reviews","unavailability","dynamicPricing"
  ]);

  const images = property.rentalImages ?? [];
  const hasImages = images.length > 0;
  const sideImages = images.slice(1, 5);
  const placeholder = "/fallback.png";

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">

        {/* LEFT: IMAGE GALLERY SECTION */}
        <div className="flex gap-2 w-full lg:w-[600px] h-[200px] shrink-0">
          {/* Main image - takes full width if it's the only one */}
          <div
            className={`relative h-full rounded-sm overflow-hidden transition ${
              sideImages.length > 0 ? "w-[50%]" : "w-full"
            } ${hasImages ? "cursor-pointer hover:opacity-95" : ""}`}
            onClick={() => hasImages && setLightboxIndex(0)}
          >
            <Image
              src={hasImages ? process.env.NEXT_PUBLIC_API_BASE_URL + images[0] : placeholder}
              alt="Main"
              fill
              className="object-cover"
            />
          </div>

          {/* Side grid - only renders if there are extra images */}
          {sideImages.length > 0 && (
            <div className="grid grid-cols-2 grid-rows-2 gap-2 w-[50%] h-full">
              {sideImages.map((img, index) => (
                <div
                  key={index}
                  className="relative rounded-sm overflow-hidden cursor-pointer hover:opacity-90 transition"
                  onClick={() => setLightboxIndex(index + 1)}
                >
                  <Image
                    src={process.env.NEXT_PUBLIC_API_BASE_URL + img}
                    alt={`Gallery ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: CONTENT SECTION */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div className="space-y-2">
            <CoreDetails property={property} />
            <Rating property={property} />
          </div>

          {/* DYNAMIC FIELDS - SCROLLABLE BUT HIDDEN SCROLLBAR */}
          <div className="border-t border-gray-50 pt-4 mt-auto">
            <div className="flex flex-nowrap gap-8 overflow-x-auto no-scrollbar" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {cleanedData.map((item, index) =>
                Object.entries(item).map(([key, value]) => (
                  <div key={`${index}-${key}`} className="shrink-0">
                    <p className="text-gray-400 text-[11px] uppercase tracking-wider mb-0.5">{key}</p>
                    <p className="font-semibold text-gray-800 text-sm capitalize whitespace-nowrap">
                      {String(value)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && hasImages && (
        <Lightbox
          open={lightboxIndex !== null}
          close={() => setLightboxIndex(null)}
          index={lightboxIndex}
          slides={images.map((img) => ({
            src: process.env.NEXT_PUBLIC_API_BASE_URL + img,
          }))}
          plugins={[Thumbnails]}
        />
      )}
    </div>
  );
};

export default PropertyHeader;