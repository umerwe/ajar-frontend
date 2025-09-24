import { Button } from '@/components/ui/button'
import { Listing } from '@/types/listing'
import { ChevronRight } from 'lucide-react'

const ExploreArea = ({ property }: { property: Listing }) => {
    return (
        <div className='space-y-3'>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Explore the area</h2>

            <div className="border-2 border-gray-300 rounded-xl">
                {/* Google Map instead of Image */}
                <div className="w-full h-40 sm:h-54 md:h-44 lg:h-48 bg-gray-200 rounded-t-xl overflow-hidden relative">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(property.address)}`}
                    ></iframe>
                </div>

                <div className="p-3 md:p-4">
                    <p className="text-sm md:text-base font-medium text-gray-800">{property.address}</p>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-aqua text-sm flex items-center cursor-pointer"
                    >
                        <p>View in the map</p>
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                </div>
            </div>

            <div className="p-3 md:p-4 pt-0 rounded-lg space-y-3">
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="outline" className="w-full md:w-auto">
                        See all about this area
                    </Button>
                </a>
            </div>
        </div>
    )
}

export default ExploreArea


// {property.nearLocation.map((item, i) => (
//     <div key={i} className="flex items-center justify-between text-sm">
//         <div className="flex items-center space-x-2">
//             <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
//             <span className="text-gray-700 font-medium">{item}</span>
//         </div>
//         {/* <span className="text-gray-600 text-xs sm:text-sm whitespace-nowrap">{item.walkTime}</span> */}
//     </div>
// ))}
