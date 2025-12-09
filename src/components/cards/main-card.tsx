import { Card } from "@/components/ui/card";
import CardTop from "./card-header";
import CardBody from "./card-body";
import CardBottom from "./card-footer";
import { Listing } from "@/types/listing";
import { useRouter } from "next/navigation";

interface MainCardProps {
  listings: (Listing & { bookingId?: string; totalPrice?: number })[];
  showRemoveButton?: boolean;
  type?: "booking" | "listing" | "filter"
  isApproved?: boolean;
}

const MainCard = ({ listings, showRemoveButton = false, type, isApproved }: MainCardProps) => {
  const router = useRouter();

  return (
    <div className="min-h-[400px] 2xl:max-w-[1400px] 2xl:mx-auto">
      <div
        className={`grid grid-cols-2 gap-2 w-full
          ${type === "filter"
            ? "sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 sm:gap-4"
            : "sm:grid-cols-2 md:grid-cols-3 p-2 sm:p-4 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6 sm:gap-4"
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
            className="w-full mx-auto border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 pb-0 overflow-hidden"
          >
            <div className="flex flex-col h-full">

              {/* Image Section - Takes full width now */}
              <div className="w-full relative aspect-square sm:aspect-auto">
                <CardTop property={property} showRemoveButton={showRemoveButton} />
              </div>

              <div className="flex flex-col sm:px-0.5 justify-between flex-grow w-full gap-1 sm:gap-2">
                <CardBody property={property} />
                <CardBottom
                  property={property}
                  bookingId={property.bookingId}
                  totalPrice={property?.totalPrice}
                  isApproved={isApproved}
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