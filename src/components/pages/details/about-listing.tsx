import { Listing } from '@/types/listing'

const AboutListing = ({ property }: { property: Listing }) => {
    return (
        <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-[12px]">About</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-full first-letter:uppercase">
                <span>
                    {property.description || 'No description available.'}
                </span>
            </p>
        </div>
    )
}

export default AboutListing
