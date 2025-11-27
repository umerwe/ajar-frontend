import { Card } from "@/components/ui/card";
import CardTop from "./card-header";
import CardBody from "./card-body";
import CardBottom from "./card-footer";
import { Listing } from "@/types/listing";

interface MainCardProps {
  listings: Listing[];
  showRemoveButton?: boolean;
  type?: "booking" | "listing" | "filter";
}

const MainCard = ({ listings, showRemoveButton = false, type }: MainCardProps) => {
  return (
    <div className="min-h-[400px]">
      <div
        className={`grid grid-cols-1 gap-4 w-full
    ${type === "filter"
            ? "sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4" // Filter mode
            : "sm:grid-cols-2 md:grid-cols-3 p-4 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6" // Default mode
          }
  `}      >
        {listings?.map((property, index) => (
          <Card
            key={index}
            className="w-full sm:max-w-[320px] mx-auto border-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 pb-0"
          >
            <div className="flex sm:block items-center min-[500px]:gap-2">
              <div className="w-[40%] min:[500px]:w-[35%] sm:w-full">
                <CardTop property={property} showRemoveButton={showRemoveButton} />
              </div>
              <div className="flex flex-col sm:mt-0 gap-2 w-[60%] min:[500px]:w-[65%] sm:w-full">
                <CardBody property={property} />
                <CardBottom
                  property={property}
                  type={type}
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
