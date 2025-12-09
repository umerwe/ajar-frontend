// import {
//   AirVent,
//   Bath,
//   BedSingle,
//   Star,
//   Wifi,
//   Fuel,
//   Settings,
//   Users,
// } from "lucide-react";
// import { RectangleGroupIcon } from "@heroicons/react/24/outline";
import { CardContent } from "@/components/ui/card";
import { Listing } from "@/types/listing";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { Star } from "lucide-react";

const CardBody = ({ property }: { property: Listing }) => {

  return (
    <CardContent className="-mt-1">
      {/* Title + Rating */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm 2xl:text-base truncate">{capitalizeWords(property?.name)}</h3>

        <div className="flex items-center gap-1 text-xs sm:text-sm">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-header">{property.ratings?.count || 0}</span>
          <span className="text-header">({property.ratings?.average || 0})</span>
        </div>
      </div>


      <p className="text-xs text-[#00CC99] font-medium mb-2 truncate 2xl:mt-0.5">
        Location: {property.address}
      </p>
    </CardContent >
  );
};

export default CardBody;
