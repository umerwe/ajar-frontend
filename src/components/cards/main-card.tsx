import { Card } from "@/components/ui/card";
import CardTop from "./card-header";
import CardBody from "./card-body";
import CardBottom from "./card-footer";
import { Listing } from "@/types/listing";
import { useRouter } from "next/navigation";

interface MainCardProps {
  listings: (Listing & { bookingId?: string; totalPrice?: number, bookingStatus?: string, dates?: { checkIn: string; checkOut: string } })[];
  showRemoveButton?: boolean;
  type?: "booking" | "listing" | "filter"
  isHome?: boolean
}

const MainCard = ({ listings, showRemoveButton = false, type, isHome }: MainCardProps) => {
  const router = useRouter();

  return (
    <div className={`min-h-[400px] ${isHome ? "mt-0" : "mt-2"}`}>
      <div
        className={`grid grid-cols-2 gap-2 w-full
          ${type === "filter"
            ? "sm:grid-cols-2 md:grid-cols-3 sm:gap-4"
            : "sm:grid-cols-2 md:grid-cols-3 py-2 sm:py-4 lg:grid-cols-4 sm:gap-4"
          }
        `}
      >
        {listings?.map((property, index) => (
          <Card
            onClick={() => {
              const path = property?.bookingId
                ? `/booking/details/${property.bookingId}`
                : property?.subCategory?._id && property?._id
                  ? `/listing/${property.subCategory._id}/${property._id}`
                  : "/";

              router.push(path);
            }}
            key={index}
            className="w-full mx-auto border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 pb-0 overflow-hidden cursor-pointer"
          >
            <div className="flex flex-col h-full">

              <div className="w-full relative aspect-square sm:aspect-auto">
                <CardTop
                  property={property}
                  showRemoveButton={showRemoveButton}
                  type={type}
                />
              </div>

              <div className="flex flex-col sm:px-0.5 justify-between flex-grow w-full gap-1 sm:gap-2">
                <CardBody
                  property={property}
                  bookingStatus={property?.bookingStatus}
                />
                <CardBottom
                  property={property}
                  bookingId={property.bookingId}
                  totalPrice={property?.totalPrice}
                  dates={property?.dates}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MainCard;