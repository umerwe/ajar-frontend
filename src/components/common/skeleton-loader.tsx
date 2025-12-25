import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

const SkeletonLoader = ({ count = 10, variant = "cards", isFav = false, type }: SkeletonLoaderProps) => {
  switch (variant) {
    case "subcategories":
      return (
        <div className="flex justify-between">
          {/* Desktop */}
          <div className="hidden md:flex flex-wrap gap-3 flex-grow">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 animate-pulse w-24 h-10"
              />
            ))}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex-grow max-w-50">
            <div className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-lg border bg-gray-200 animate-pulse h-12" />
          </div>

          {/* Filter Button */}
          <div>
            <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse" />
          </div>
        </div>
      );

    case "cards":
      return (
        <div className={`sm:mb-15 ${type === "filter" ? "mt-0" : "mt-0"}`}>
          <div className={`flex items-center justify-between pt-6 bg-white ${isFav ? "block" : "hidden"}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200" />
              <div className="h-6 w-40 bg-gray-200 rounded" />
            </div>
            <div className="px-3 py-1 w-24 h-6 bg-gray-200 rounded" />
          </div>

          <div className="min-h-[400px]">
            <div
              className={`grid grid-cols-2 gap-2 w-full
            ${type === "filter"
                  ? "sm:grid-cols-2 md:grid-cols-3 sm:gap-4"
                  : "sm:grid-cols-2 md:grid-cols-3 py-2 sm:py-4 lg:grid-cols-4 sm:gap-4"
                }
          `}
            >
              {Array.from({ length: count }).map((_, index) => (
                <Card
                  key={index}
                  className="w-full mx-auto border-0 bg-white shadow-sm pb-0 animate-pulse overflow-hidden"
                >
                  <div className="flex flex-col h-full">
                    {/* Image Placeholder */}
                    <div className="w-full relative aspect-square sm:aspect-auto">
                      <div className="w-full h-full sm:h-54 bg-gray-200 rounded-xl" />
                    </div>

                    {/* Content Placeholders */}
                    <div className="flex md:px-1 flex-col justify-between flex-grow w-full gap-1 p-1 sm:p-0 sm:gap-2">

                      {/* Body Placeholder */}
                      <div className="mt-1 sm:mt-5">
                        <div className="flex items-center justify-between">
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-8" />
                        </div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mt-2" />
                      </div>

                      {/* Footer Placeholder */}
                      <div className="pb-2 pt-0 flex justify-between items-center mt-auto w-full">
                        <div className="flex flex-col gap-1">
                          <div className="h-4 sm:h-5 bg-gray-200 rounded w-10 sm:w-16" />
                          <div className="h-2 sm:h-3 bg-gray-200 rounded w-8 sm:w-12" />
                        </div>
                        {/* Hide button skeleton if it's a booking type to match your logic */}
                        {type !== "booking" && (
                          <div className="h-8 min-[500px]:h-9 bg-gray-200 rounded-full w-16 sm:w-24" />
                        )}
                      </div>

                      {/* New Booking Details Skeleton (Only shows if type is booking) */}
                      {type === "booking" && (
                        <div className="pb-4 flex flex-col gap-3 mt-1">
                          {/* Dates Row Skeleton */}
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded" />
                            <div className="h-3 bg-gray-200 rounded w-1/3" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );


      return (
        <div className="mx-3 sm:mx-7 animate-pulse">
          {/* Header */}
          <div className="flex items-center justify-between pt-6 bg-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200" />
              <div className="h-6 w-40 bg-gray-200 rounded" />
            </div>
            <div className="px-3 py-1 w-24 h-6 bg-gray-200 rounded" />
          </div>

          {/* Image Gallery */}
          <div className="py-6">
            <div className="flex flex-col md:flex-row gap-2 h-auto">
              {/* Big Left Image */}
              <div className="w-full md:w-[45%] lg:w-[45%] h-[250px] sm:h-[280px] xl:h-[340px] min-h-[250px] rounded-lg bg-gray-200" />
              {/* Right Side Grid */}
              <div className="w-full md:w-[55%] lg:w-[55%] h-auto md:h-[280px] xl:h-[340px]">
                <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-2 h-full">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-full h-full rounded-lg bg-gray-200" />
                  ))}
                </div>
                <div className="md:hidden flex gap-2 overflow-x-auto pb-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-lg bg-gray-200" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs (First Set) */}
          <div className="overflow-x-auto mb-6 sm:px-3">
            <ul className="flex space-x-4 sm:space-x-6 lg:space-x-8 min-w-max">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="h-6 w-20 bg-gray-200 rounded" />
              ))}
            </ul>
          </div>

          {/* Main Content: Left and Right Columns */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 px-3 md:px-6">
            {/* Left Column */}
            <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col gap-4">
              {/* Core Details */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <div className="h-6 w-3/4 bg-gray-200 rounded" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex gap-1 items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded-full" />
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex flex-row sm:items-center gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-6 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="w-4 h-4 bg-gray-200 rounded-full" />
                </div>
              </div>

              {/* About Listing */}
              <div>
                <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-16 w-full max-w-[520px] bg-gray-200 rounded mb-4" />
                <div className="h-10 w-32 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-2/5 lg:w-1/3 space-y-4">
              {/* Pricing Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between items-start sm:items-center md:items-start lg:items-center gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="h-6 w-20 bg-gray-200 rounded" />
                </div>
                <div className="h-10 w-full sm:w-32 md:w-full lg:w-32 bg-gray-200 rounded" />
              </div>

              {/* Explore Area */}
              <div className="space-y-3">
                <div className="h-6 w-32 bg-gray-200 rounded" />
                <div className="border-2 border-gray-300 rounded-xl">
                  <div className="w-full h-40 sm:h-54 md:h-44 lg:h-48 bg-gray-200 rounded-t-xl" />
                  <div className="p-3 md:p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="w-4 h-4 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="h-10 w-full md:w-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Host Info and Second Tabs */}
          <div className="sm:px-3 mt-8">
            {/* Host Info (Simplified) */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-48 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Tabs (Second Set) */}
            <div className="overflow-x-auto border-b mb-6">
              <ul className="flex space-x-4 sm:space-x-6 lg:space-x-8 min-w-max">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="h-6 w-20 bg-gray-200 rounded" />
                ))}
              </ul>
            </div>
          </div>

          {/* Services & Amenities (Simplified) */}
          <div className="px-3 md:px-6">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-3/4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      );

    case "listing":
      return (
        <div className="mb-9 animate-pulse">

          {/* Image Gallery - Matching ImageGalleryLayout.tsx structure */}
          <div className="pb-6">
            <div className="flex flex-col md:flex-row gap-2 h-auto">
              {/* Big Left Image */}
              <div className="w-full md:w-[45%] lg:w-[45%] h-[250px] sm:h-[280px] xl:h-[340px] min-h-[250px] rounded-lg bg-gray-200" />

              {/* Right Side Grid */}
              <div className="w-full md:w-[55%] lg:w-[55%] h-auto md:h-[280px] xl:h-[340px]">
                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-2 h-full">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-full h-full rounded-lg bg-gray-200" />
                  ))}
                </div>
                {/* Mobile Scroll */}
                <div className="md:hidden flex gap-2 overflow-hidden pb-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-lg bg-gray-200" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Layout - Matching BookingDetails.tsx structure */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">

            {/* LEFT COLUMN */}
            <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col gap-6">

              {/* Core Details */}
              <div className="space-y-3">
                <div className="h-8 w-3/4 bg-gray-200 rounded" /> {/* Title */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-gray-200 rounded" /> {/* Stars */}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="h-4 w-1/2 bg-gray-200 rounded" /> {/* Address */}
                  <div className="h-4 w-20 bg-gray-200 rounded" /> {/* Map Link */}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-gray-200 rounded" /> {/* Score Box */}
                <div className="h-4 w-20 bg-gray-200 rounded" /> {/* "Excellent" */}
                <div className="h-4 w-32 bg-gray-200 rounded ml-2" /> {/* Reviews link */}
              </div>

              {/* About Listing */}
              <div className="mt-2">
                <div className="h-6 w-24 bg-gray-200 rounded mb-3" /> {/* "About" Title */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Host Info */}
              <div className="mt-4">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4" /> {/* "Hosted By" Title */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" /> {/* Avatar */}
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-gray-200 rounded" /> {/* Name */}
                      <div className="h-3 w-40 bg-gray-200 rounded" /> {/* Email */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full md:w-2/5 lg:w-1/3 space-y-6">

              {/* Pricing Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between items-start sm:items-center md:items-start lg:items-center gap-3">
                <div className="h-8 w-32 bg-gray-200 rounded" /> {/* Price */}
                <div className="h-10 w-full sm:w-32 md:w-full lg:w-32 bg-gray-200 rounded" /> {/* Action Button */}
              </div>

              {/* Explore Area */}
              <div className="space-y-3 pt-2">
                <div className="h-6 w-40 bg-gray-200 rounded" /> {/* "Explore Area" Title */}
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                  <div className="w-full h-40 sm:h-54 md:h-44 lg:h-48 bg-gray-200" /> {/* Map Image */}
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" /> {/* Address Text */}
                    <div className="h-4 w-24 bg-gray-200 rounded" /> {/* View Map link */}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      );

    case "profile":
      return (
        <div className="flex flex-col items-center space-y-3">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-full overflow-hidden">
            <Skeleton className="h-full w-full rounded-full" />
          </div>

          {/* Name + Email */}
          <div className="text-center space-y-2">
            <Skeleton className="h-5 w-28 mx-auto rounded" />
            <Skeleton className="h-4 w-40 mx-auto rounded" />
          </div>
        </div>
      )
    case "chat":
      return (
        <>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse overflow-y-hidden">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="h-3 w-8 bg-gray-200 rounded"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </>
      );

    case "messages":
      return (
        <div className="space-y-5">
          {[...Array(count)].map((_, i) => {
            const isSent = i % 2 === 1;
            return (
              <div
                key={i}
                className={`flex items-start gap-2 ${isSent ? "justify-end" : "justify-start"}`}
              >
                {/* Receiver Avatar (left side only) */}
                {!isSent && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                )}

                {/* Message Bubble Skeleton */}
                <div
                  className={`flex flex-col gap-2 ${isSent ? "items-end" : "items-start"
                    }`}
                >
                  <div
                    className={`h-3 w-16 bg-gray-200 rounded animate-pulse ${isSent ? "self-end" : ""
                      }`}
                  />
                  <div
                    className={`h-10 w-52 bg-gray-200 rounded-xl animate-pulse ${isSent ? "self-end" : ""
                      }`}
                  />
                </div>

                {/* Sender Avatar (right side only) */}
                {isSent && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      )
    case "searchbar":
      return (
        <div className="text-white px-4 sm:px-6 md:px-11 py-4 sm:py-6 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex flex-col lg:flex-row lg:divide-y-0 lg:divide-x divide-gray-200">
              {/* Location Skeleton */}
              <div className="relative flex-1 px-4 sm:px-6 md:px-8 py-3 min-w-0 flex items-center gap-2 sm:gap-3">
                <div className="bg-gray-200 rounded-full w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />

                <div className="flex-1 space-y-1">
                  <div className="bg-gray-200 rounded h-3 sm:h-4 w-16 animate-pulse" />
                  <div className="bg-gray-300 rounded h-4 sm:h-5 w-32 animate-pulse" />
                </div>

                <div className="bg-gray-200 rounded w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </div>

              {/* Search Button Skeleton - HIDDEN on mobile now */}
              <div className="hidden lg:flex p-3 sm:p-4 lg:p-0 items-center justify-center rounded-b-xl lg:rounded-r-xl">
                <div className="bg-gray-200 rounded-xl h-10 sm:h-12 w-full lg:w-32 lg:min-w-32 lg:px-8 mx-3 sm:mx-4 lg:mx-6 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )
    case "article":
      return (
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border border-gray-200 shadow-sm h-full">
            <CardContent className="md:p-6 p-4">
              <div className="flex items-start mb-4">
                <Skeleton className="w-12 h-12 rounded-lg shrink-0 mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))
      )
    case "checkout":
      return (
        <div className="min-h-screen mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
            {/* LEFT COLUMN SKELETON */}
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-16 mb-4 bg-gray-200" /> {/* Date Header */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-[74px] rounded-lg bg-gray-200" /> {/* Input 1 */}
                  <Skeleton className="h-[74px] rounded-lg bg-gray-200" /> {/* Input 2 */}
                </div>
              </div>
              <div>
                <Skeleton className="h-6 w-24 mb-4 bg-gray-200" /> {/* Comments Header */}
                <Skeleton className="h-40 w-full rounded-lg bg-gray-200" /> {/* Textarea */}
              </div>
              <Skeleton className="h-12 w-full sm:w-48 rounded-full bg-gray-200" /> {/* Button */}
            </div>

            {/* RIGHT COLUMN SKELETON */}
            <div className="space-y-6">
              {/* Listing Card Skeleton */}
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                <div className="flex gap-4 mb-4">
                  <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0 bg-gray-200" />
                  <div className="flex-1 space-y-2 py-1">
                    <Skeleton className="h-6 w-3/4 bg-gray-200" />
                    <Skeleton className="h-4 w-1/2 bg-gray-200" />
                    <div className="flex gap-2 pt-1">
                      <Skeleton className="h-6 w-16 rounded-l-2xl rounded-b-2xl bg-gray-200" />
                      <Skeleton className="h-6 w-20 bg-gray-200" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details Skeleton */}
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <Skeleton className="h-6 w-40 bg-gray-200" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24 bg-gray-200" />
                    <Skeleton className="h-5 w-16 bg-gray-200" />
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <Skeleton className="h-6 w-24 bg-gray-200" />
                    <Skeleton className="h-6 w-20 bg-gray-200" />
                  </div>
                </div>
              </div>

              {/* Cancellation Policy Skeleton */}
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
                <Skeleton className="h-6 w-48 bg-gray-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-200" />
                  <Skeleton className="h-16 w-full bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case "wallet":
      return (
        <div className="animate-pulse">

          <div className="max-w-md mx-auto border py-8 rounded-md">
            {/* Balance Section */}
            <section className="flex flex-col items-center px-4">
              <div className="h-4 w-24 bg-gray-200 rounded mb-3" /> {/* Your Balance text */}
              <div className="h-10 w-40 bg-gray-200 rounded" /> {/* Amount */}
            </section>

            {/* Action Buttons */}
            <section className="flex justify-around mt-10 px-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-gray-200 rounded-full" />
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                </div>
              ))}
            </section>

            {/* Latest Transactions Section */}
            <section className="mt-12 px-5">
              <div className="flex items-center justify-between mb-5">
                <div className="h-6 w-36 bg-gray-200 rounded" /> {/* Title */}
                <div className="h-4 w-16 bg-gray-200 rounded" /> {/* See All */}
              </div>

              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="space-y-2">
                        <div className="h-4 w-28 bg-gray-200 rounded" />
                        <div className="h-3 w-20 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="h-5 w-12 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      );

    case "transactions":
      return (
        <div className="min-h-screen bg-white max-w-md mx-auto border rounded-md py-6 px-5">
          <div className="space-y-6">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-5 w-14 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      );

    case "bank-accounts":
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card
          key={i}
          className="border bg-white shadow-sm rounded-2xl overflow-hidden"
        >
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                {/* Icon */}
                <div className="pt-1">
                  <Skeleton className="w-5 h-5 rounded bg-slate-200" />
                </div>

                {/* Bank + Account Name */}
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-36 rounded bg-slate-200" />
                  <Skeleton className="h-4 w-28 rounded bg-slate-200" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-1">
                <Skeleton className="w-9 h-9 rounded-full bg-slate-200" />
                <Skeleton className="w-9 h-9 rounded-full bg-slate-200" />
              </div>
            </div>

            {/* Divider + Details */}
            <div className="mt-6 space-y-3 border-t pt-5 border-slate-50">
              <div className="flex items-center">
                <Skeleton className="h-3 w-36 mr-4 rounded bg-slate-200" />
                <Skeleton className="h-3 w-44 rounded bg-slate-200" />
              </div>

              <div className="flex items-center">
                <Skeleton className="h-3 w-36 mr-4 rounded bg-slate-200" />
                <Skeleton className="h-3 w-44 rounded bg-slate-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

    
      default: <div></div>;

  }
};

export default SkeletonLoader;
