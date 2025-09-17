// import React from 'react'

// const GuestReview = ({ property }: DataProps) => {
//     return (
//         <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Guest Reviews</h2>
//             <div className='flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-8'>
//                 {/* Overall Rating */}
//                 <div className="flex items-center space-x-4 mb-2 lg:mb-0">
//                     <div className="bg-aqua text-white px-4 py-2 rounded-l-full rounded-b-full">
//                         <span className="text-2xl font-bold">{property.rating.toFixed(1)}</span>
//                         <span className="text-lg">/10</span>
//                     </div>
//                     <div>
//                         <p className="text-lg font-semibold text-aqua">Good</p>
//                         <p className="text-sm text-gray-600">{property.reviewCount} reviews</p>
//                     </div>
//                 </div>

//                 {/* Rating Breakdown */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 w-full lg:w-165">
//                     <div className="space-y-3">
//                         <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-gray-700">Cleanliness</span>
//                             <span className="text-sm font-semibold text-aqua">{property.highlights.cleanliness}</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                                 className="bg-aqua h-2 rounded-full"
//                                 style={{ width: `${(property.highlights.cleanliness / 10) * 100}%` }}
//                             ></div>
//                         </div>
//                     </div>
//                     <div className="space-y-3">
//                         <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-gray-700">Amenities</span>
//                             <span className="text-sm font-semibold text-aqua">{property.highlights.amenities}</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                                 className="bg-aqua h-2 rounded-full"
//                                 style={{ width: `${(property.highlights.amenities / 10) * 100}%` }}
//                             ></div>
//                         </div>
//                     </div>
//                     <div className="space-y-3">
//                         <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-gray-700">Location</span>
//                             <span className="text-sm font-semibold text-aqua">{property.highlights.location}</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                                 className="bg-aqua h-2 rounded-full"
//                                 style={{ width: `${(property.highlights.location / 10) * 100}%` }}
//                             ></div>
//                         </div>
//                     </div>
//                     <div className="space-y-3">
//                         <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-gray-700">Service</span>
//                             <span className="text-sm font-semibold text-aqua">{property.highlights.service}</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                                 className="bg-aqua h-2 rounded-full"
//                                 style={{ width: `${(property.highlights.service / 10) * 100}%` }}
//                             ></div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default GuestReview
