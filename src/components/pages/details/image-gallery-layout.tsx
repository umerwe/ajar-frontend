"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Star, ChevronRight } from "lucide-react";
import { Listing } from "@/types/listing";
import { capitalizeWords } from "@/utils/capitalizeWords";
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

// Using your provided static images for demonstration
const staImg = [
  "/appartments-img1.webp",
  "/appartments-img2.webp",
  "/appartments-img3.webp",
  "/appartments-img4.webp",
  "/appartments-img5.webp",
  "/appartments-img6.webp",
  "/appartments-img7.jpg",
  "/appartments-img8.jpg",
  "/appartments-img1.webp",
]

const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""; // Not needed if using local staImg
  const cleanedData = removeFields(property as any, [
    "_id",
    "leaser",
    "subCategory",
    "zone",
    "ratings",
    "name",
    "subTitle",
    "images",
    "rentalImages",
    "description",
    "price",
    "isActive",
    "language",
    "documents",
    "isAvailable",
    "currentBookingId",
    "status",
    "priceUnit",
    "createdAt",
    "updatedAt",
    "__v",
    "userDocuments",
    "leaserDocuments",
    "adminFee",
    "tax",
    "languages"
  ]);

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">

        {/* LEFT: IMAGE GALLERY SECTION */}
        <div className="flex gap-2 w-full lg:w-[600px] h-[200px] shrink-0">
          {/* Main Large Image */}
          <div
            className="relative w-[50%] h-full rounded-sm overflow-hidden cursor-pointer hover:opacity-95 transition"
            onClick={() => setLightboxIndex(0)}
          >
            <Image
              src={staImg[0]}
              alt="Main"
              fill
              className="object-cover"
            />
          </div>

          {/* 2x2 Small Grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-2 w-[50%] h-full">
            {staImg.slice(1, 5).map((img, index) => (
              <div
                key={index}
                className="relative rounded-sm overflow-hidden cursor-pointer hover:opacity-90 transition"
                onClick={() => setLightboxIndex(index + 1)}
              >
                <Image
                  src={img}
                  alt={`Gallery ${index}`}
                  fill
                  className="object-cover"
                />
                {/* Overlay on the last visible image if there are more */}
                {/* UPDATED: Switched to checking staImg length for consistency */}
                {index === 3 && staImg.length > 5 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-bold">
                    +{staImg.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: CONTENT SECTION */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-2">
            <CoreDetails
              property={property}
            />

            <Rating
              property={property}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-50">
            {cleanedData.map((item, index) =>
              Object.entries(item).map(([key, value]) => (
                <div key={`${index}-${key}`}>
                  <p className="text-gray-400 text-sm capitalize truncate">{key}</p>
                  <p className="font-semibold text-gray-800 text-sm truncate">{value}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <Lightbox
          open={lightboxIndex !== null}
          close={() => setLightboxIndex(null)}
          index={lightboxIndex}
          // UPDATED: Use staImg for the lightbox slides so it matches what is clicked
          slides={staImg.map((src) => ({ src: src }))}
          plugins={[Thumbnails]}
        />
      )}
    </div>
  );
};

export default PropertyHeader;