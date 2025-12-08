import React from 'react'
// import FeaturesList from './feature-list'
import { Listing } from '@/types/listing'

const AboutListing = ({ property }: { property: Listing }) => {
    return (
        <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mt-3">About</h2>
            <p className="text-gray-600 text-sm md:text-base max-w-full lg:max-w-130">
                <span>
                    {property.subTitle}
                </span>
            </p>
            {/* <FeaturesList property={property} /> */}
            {/* <Button variant="outline" className="mt-1 bg-transparent w-full sm:w-auto">
                See all about this property
            </Button> */}
        </div>
    )
}

export default AboutListing
