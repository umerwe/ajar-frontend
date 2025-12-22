import { CardContent } from "@/components/ui/card";
import { Listing } from "@/types/listing";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { getStatusStyles } from "@/constants/booking";
import { Star } from "lucide-react";

type CardBodyProps = {
  property: Listing;
  bookingStatus?: string;
};

const CardBody = ({ property, bookingStatus }: CardBodyProps) => {
  return (
    <CardContent className="-mt-1">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm 2xl:text-base truncate mr-2">
          {capitalizeWords(property?.name)}
        </h3>

        {bookingStatus ? (
          <span
            className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 md:pb-1 ${getStatusStyles(
              bookingStatus
            )}`}
          >
            {capitalizeWords(bookingStatus)}
          </span>
        ) : (
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-header">{property.ratings?.count || 0}</span>
            <span className="text-header">
              ({property.ratings?.average || 0})
            </span>
          </div>
        )}
      </div>

      {
        bookingStatus && 
        <div className="flex items-center gap-1 text-xs my-1">
        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-header">{property.ratings?.count || 0}</span>
        <span className="text-header">
          ({property.ratings?.average || 0})
        </span>
      </div>
      }

      <p className="text-xs text-[#00CC99] font-medium mb-2 truncate 2xl:mt-0.5">
        Location: {property.address}
      </p>
    </CardContent>
  );
};

export default CardBody;