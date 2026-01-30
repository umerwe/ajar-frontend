import { Listing } from '@/types/listing'
import { ChevronRight } from 'lucide-react'

const ExploreArea = ({ property }: { property: Listing }) => {
    return (
        <div className='space-y-3'>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Explore the area</h2>

            <div className="border-2 border-gray-300 rounded-xl">
                <div className="w-full h-40 sm:h-54 md:h-44 lg:h-48 bg-gray-200 rounded-t-xl overflow-hidden relative">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(property.zone.name)}`}
                    ></iframe>
                </div>

                <div className="p-3 md:p-4">
                    <p className="text-sm md:text-base font-medium text-gray-800 capitalize">{property.zone.name}</p>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.zone.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-aqua text-sm flex items-center cursor-pointer"
                    >
                        <p>View in the map</p>
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ExploreArea
