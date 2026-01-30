import { Button } from "@/components/ui/button"
import { Listing } from "@/types/listing"
import { capitalizeWords } from "@/utils/capitalizeWords"
import { ChevronRight, MapPin, Star } from "lucide-react"

const CoreDetails = ({ property }: { property: Listing }) => {
    return (
        <div>
            <h1 className="text-xl font-semibold text-gray-800 flex flex-col sm:flex-row sm:items-center gap-2">
                <span>{capitalizeWords(property.name)}</span>
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                    ))}
                </div>
            </h1>

            <h2 className="text-sm mb-1">{capitalizeWords(property.subTitle)}</h2>

            <div className="text-xs sm:text-sm text-gray-900 font-medium flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-20">
                <div className="flex gap-1 items-center">
                    <MapPin className="w-4 h-4 text-aqua" />
                    <span>{capitalizeWords(property?.zone?.name)}</span>
                </div>

                {/* Show on Map link */}
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property?.zone?.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start sm:self-auto"
                >
                    <Button
                        variant="link"
                        className="p-0 h-auto text-aqua font-medium cursor-pointer"
                    >
                        Show on map
                         <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </a>
            </div>
        </div>
    )
}

export default CoreDetails
