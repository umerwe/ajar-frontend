"use client";

import { useState } from "react";
import { House, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useGetZones } from "@/hooks/useZone";
import { capitalizeWords } from "@/utils/capitalizeWords";
import Loader from "@/components/common/loader";
// Define the interface for Zone if not imported
interface Zone {
  _id: string;
  name: string;
}

export default function SearchBar() {
  const { data, isLoading } = useGetZones();
  const zones = data?.zones;

  const [zoneId, setZoneId] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    router.push(`/?zone=${zoneId}`);
  };

  const handleZoneSelect = (selectedId: string) => {
    setZoneId(selectedId);

    // Logic: If on mobile (screen width < 1024px), navigate immediately
    // We use 1024px because that matches the 'lg' tailwind breakpoint used in your layout
    if (window.innerWidth < 1024) {
      router.push(`/?zone=${selectedId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="text-white px-4 sm:px-6 md:px-11 py-4 sm:py-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
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
    );
  }

  return (
    <div className="text-white px-4 sm:px-6 md:px-11 py-4 sm:py-6 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {/* Location Dropdown Group */}
          <div className="relative flex-1 px-4 sm:px-6 md:px-8 py-3 sm:py-2.5 min-w-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 sm:gap-3 cursor-pointer w-full">
                  <House className="text-gray-500 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      Location
                    </p>
                    <p className="font-bold text-sm sm:text-base text-gray-800 truncate">
                      {zones?.find((z: Zone) => z._id === zoneId)?.name ||
                        "Select a location"}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto"
              >
                {zones?.map((loc: Zone, index: number) => (
                  <DropdownMenuItem
                    key={index}
                    className="p-2 sm:p-3 cursor-pointer text-gray-800 text-sm font-medium"
                    // UPDATED: Now calls handleZoneSelect instead of just setZoneId
                    onClick={() => handleZoneSelect(loc._id)}
                  >
                    {capitalizeWords(loc.name)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search Button - UPDATED: 'hidden lg:flex' ensures it hides on mobile */}
          <div className="hidden lg:flex p-3 sm:p-4 lg:p-0 items-center hover:bg-gray-100 justify-center rounded-b-xl lg:rounded-r-xl">
            <Button
              variant="secondary"
              onClick={handleSearch}
              className="font-semibold text-sm sm:text-base lg:text-lg bg-transparent text-aqua rounded-xl h-10 sm:h-12 w-full lg:w-32 lg:min-w-32 lg:px-8 mx-3 sm:mx-4 lg:mx-6 disabled:cursor-no-drop"
              disabled={zoneId === "" || isLoading}
            >
              {isLoading ? <Loader /> : "Search"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}