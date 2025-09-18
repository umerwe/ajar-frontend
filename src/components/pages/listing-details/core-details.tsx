import { Button } from "@/components/ui/button"
import { MapPin, Star } from "lucide-react"

const CoreDetails = ({ property }: { property: Listing }) => {
    return (
        <div>
            <h1 className="text-xl sm:text-2xl md:text-2xl 2xl:text-3xl font-semibold text-gray-800 mb-2 md:mb-1 flex flex-col sm:flex-row sm:items-center gap-2">
                <span>{property.name}</span>
                <div className="flex pt-0 sm:pt-1.5 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-yellow-400 text-yellow-400"
                        />
                    ))}
                </div>
            </h1>

            <div className="text-xs sm:text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-20">
                <div className="flex gap-1 items-center">
                    <MapPin color="black" className="w-4 h-4" />
                    <span>{property.address}</span>
                </div>

                {/* Show on Map link */}
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start sm:self-auto"
                >
                    <Button
                        variant="link"
                        className="p-0 h-auto text-aqua font-semibold cursor-pointer"
                    >
                        Show on Map
                    </Button>
                </a>
            </div>
        </div>
    )
}

export default CoreDetails
