import { Card } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

const SkeletonLoader = ({ count = 10, variant = "cards", isFav = false, type }: SkeletonLoaderProps) => {
  switch (variant) {
    case "subcategories":
      return (
        <div className="flex justify-between px-4 sm:px-6 md:px-9 my-4">
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
        <div className="mb-15">
          <div className={`flex items-center justify-between px-6 pt-6 bg-white ${isFav ? "block" : "hidden"}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200" />
              <div className="h-6 w-40 bg-gray-200 rounded" />
            </div>
            <div className="px-3 py-1 w-24 h-6 bg-gray-200 rounded" />
          </div>
          <div className="min-h-[400px]">
            <div
              className={`grid grid-cols-1 gap-4 w-full
    ${type === "filter"
                  ? "sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4" // Filter mode
                  : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 xl:grid-cols-5 3xl:grid-cols-6" // Default mode
                }
  `}              >
              {Array.from({ length: count }).map((_, index) => (
                <Card
                  key={index}
                  className="w-full sm:max-w-[320px] mx-auto border-0 bg-white shadow-sm pb-0 animate-pulse"
                >
                  <div className="flex sm:block items-center min-[500px]:gap-2">
                    {/* Top / Image carousel placeholder */}
                    <div className="w-[40%] min-[500px]:w-[35%] sm:w-full">
                      <div className="relative w-full">
                        <div className="w-full h-40 min-[500px]:h-50 sm:h-64 bg-gray-200 rounded-2xl" />
                      </div>
                    </div>

                    {/* Body + Bottom placeholders */}
                    <div className="flex flex-col sm:mt-0 gap-2 w-[60%] min-[500px]:w-[65%] sm:w-full">
                      {/* CardBody placeholders */}
                      <div className="px-2 mt-5">
                        {/* Title + Rating */}
                        <div className="flex items-center justify-between">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="flex items-center gap-1">
                            <div className="h-4 bg-gray-200 rounded w-8" />
                          </div>
                        </div>
                        {/* Location */}
                        <div className="h-4 bg-gray-200 rounded w-2/3 mt-2" />
                      </div>

                      {/* CardBottom placeholders */}
                      <div className="px-2 sm:mb-2 min-[500px]:px-3 pb-2 pt-0 flex justify-between items-center mt-2">
                        <div className="flex flex-col gap-1">
                          <div className="h-5 bg-gray-200 rounded w-16" />
                          <div className="h-4 bg-gray-200 rounded w-12" />
                        </div>
                        <div className="h-7.5 min-[500px]:h-9 bg-gray-200 rounded w-24" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );

    case "listing":
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

          {/* Progress Section */}
          <div className="w-full mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-1 rounded-full" />
                <Skeleton className="h-5 w-10 rounded" />
              </div>
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>

            <Skeleton className="h-2 w-full mb-2 rounded" />
            <Skeleton className="h-3 w-52 rounded mx-auto" />
          </div>
        </div>
      )

    case "chat":
      return (
        <>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
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

    default: <div></div>;

  }
};

export default SkeletonLoader;
