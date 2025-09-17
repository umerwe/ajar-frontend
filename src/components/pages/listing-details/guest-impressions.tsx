import { CircleChevronRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const GuestImpressions = () => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Guest Impressions</h3>
      
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* AI Summary Section */}
        <div className="p-4 w-full lg:flex-1 border border-gray-200 rounded-lg bg-white lg:max-w-sm">
          <div className="flex items-center space-x-2">
            <Image
              src="/ai-logo.png"
              width={35}
              height={35}
              alt='ai-logo'
            />
            <span className="text-aqua font-semibold text-sm">AI Summary</span>
            <div>
              <Image
                src="/i-icon.png"
                width={20}
                height={20}
                alt='i-icon'
                className='pt-0.5'
              />
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-2">
            The property impresses guests with its convenient airport proximity, secure surroundings, and versatile event spaces. They also commend the varied, high-quality breakfast and commendable service from friendly staff.
          </p>
        </div>

        {/* Individual Reviews */}
        <div className="w-full lg:flex-1">
          {/* Mobile: Vertical stack */}
          <div className="flex flex-col sm:hidden gap-4">
            {/* {property.reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-gray-300 rounded-full flex items-center justify-center">
                    <Image
                      src={review.image}
                      width={35}
                      height={35}
                      alt="user-icon"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{review.user}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{review.review}</p>
                {review.review.length > 50 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-xs text-aqua font-medium cursor-pointer">
                      Original Text
                    </span>
                    <span className="text-xs text-gray-500">
                      Translation provided by Google
                    </span>
                  </div>
                )}
              </div>
            ))} */}
          </div>

          {/* Tablet and Desktop: Horizontal layout */}
          <div className="hidden sm:flex gap-4 overflow-x-auto lg:gap-5">
            {/* {property.reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-4 bg-white flex-shrink-0 w-full sm:w-80 lg:w-full lg:flex-1 lg:max-w-sm"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-gray-300 rounded-full flex items-center justify-center">
                    <Image
                      src={review.image}
                      width={35}
                      height={35}
                      alt="user-icon"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{review.user}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{review.review}</p>
                {review.review.length > 50 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-xs text-aqua font-medium cursor-pointer">
                      Original Text
                    </span>
                    <span className="text-xs text-gray-500">
                      Translation provided by Google
                    </span>
                  </div>
                )}
              </div>
            ))} */}
          </div>
        </div>
      </div>

      {/* Show More Button */}
      <div className="flex justify-center mt-4">
        <span className="text-aqua text-sm flex items-center cursor-pointer">
          <p>Show more</p>
          <CircleChevronRight className="pt-1 ml-1" />
        </span>
      </div>
    </div>
  )
}

export default GuestImpressions