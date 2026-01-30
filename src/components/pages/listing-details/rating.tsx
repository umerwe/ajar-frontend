import { Button } from "@/components/ui/button"
import { Listing } from "@/types/listing"
import { ChevronRight } from "lucide-react"
import { getRatingText } from "@/utils/getRatingText"

const Rating = ({ property }: { property: Listing }) => {
    const ratingLabel = getRatingText(property.ratings.average);

    return (
        <div className="flex flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center space-x-2">
                <span className="bg-aqua text-white px-2 py-1 rounded text-sm">
                    {property.ratings.average}
                </span>
                <span className="font-medium text-base text-gray-800">
                    {ratingLabel}
                </span>
            </div>

            <Button
                variant="link"
                className="p-0 h-auto text-aqua font-medium cursor-pointer hover:no-underline"
            >
                See all {property.ratings.count} reviews
                <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
        </div>
    )
}

export default Rating