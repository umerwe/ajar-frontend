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
import SkeletonLoader from "@/components/common/skeleton-loader";

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
    if (window.innerWidth < 1024) {
      router.push(`/?zone=${selectedId}`);
    }
  };

  if (isLoading) return <SkeletonLoader variant="searchbar" />

  return (
    <div className="text-white px-4 sm:px-6 md:px-11 py-4 sm:py-6 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="flex flex-col lg:flex-row lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="relative flex-1 px-4 sm:px-6 md:px-8 py-3 sm:py-2.5 min-w-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 sm:gap-3 cursor-pointer w-full">
                  <House className="text-gray-500 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      Location
                    </p>
                    <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">
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
                    onClick={() => handleZoneSelect(loc._id)}
                  >
                    {capitalizeWords(loc.name)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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