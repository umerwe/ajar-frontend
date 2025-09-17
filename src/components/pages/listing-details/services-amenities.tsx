import { BarChartIcon as ChartBarIcon, Check, Flame } from "lucide-react"
import { mostPopularAmenities, moreAmenitiesCategories, restaurantInfo } from "@/data/amenities"

const ServicesAmenities = () => {
  return (
    <div className="p-6 bg-white mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Services & Amenities</h1>

      {/* Most Popular Amenities */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 text-gray-700">
          <Flame className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Most Popular Amenities</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
          {mostPopularAmenities.map((amenity) => {
            const IconComponent = amenity.icon
            return (
              <div key={amenity.id} className="flex items-center gap-2 text-sm">
                <IconComponent className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-700">{amenity.name}</span>
                  {amenity.isFree && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Free
                    </span>
                  )}
                  {amenity.hasAdditionalCharge && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                      Additional charge
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Restaurant Section */}
      <div className="mb-8 pb-6">
        <div className="flex items-center gap-2 mb-3 text-gray-700">
          <restaurantInfo.icon className="w-5 h-5" />
          <h2 className="text-lg font-semibold">{restaurantInfo.title}</h2>
        </div>
        <div className="p-4 rounded-lg border border-gray-200 max-w-md">
          <h3 className="font-medium text-gray-900 mb-2">Restaurant</h3>
          <p className="text-sm text-gray-600">{restaurantInfo.description}</p>
        </div>
      </div>

      {/* More Amenities */}
      <div>
        <div className="flex items-center gap-2 mb-6 text-gray-700">
          <ChartBarIcon className="w-5 h-5" />
          <h2 className="text-lg font-semibold">More Amenities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {/* Column 1 */}
          <div className="space-y-6">
            {moreAmenitiesCategories
              .filter((category) => ["internet", "outdoor-pool", "parking", "transportation"].includes(category.id))
              .map((category) => {
                const CategoryIcon = category.icon
                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <CategoryIcon className="w-5 h-5" />
                      <h3 className="font-semibold">{category.title}</h3>
                    </div>
                    <div className="space-y-2">
                      {category.amenities.map((amenity) => {
                        const AmenityIcon = amenity.icon
                        return (
                          <div key={amenity.id} className="flex items-start gap-3 text-sm">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <AmenityIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                <span className="text-gray-700">{amenity.name}</span>
                              </div>
                              {amenity.description && (
                                <p className="text-xs text-gray-500 mt-1 ml-6">{amenity.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1 ml-6">
                                {amenity.isFree && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                    Free
                                  </span>
                                )}
                                {amenity.hasAdditionalCharge && (
                                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                                    Additional charge
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            {moreAmenitiesCategories
              .filter((category) => ["food-drink", "public-areas"].includes(category.id))
              .map((category) => {
                const CategoryIcon = category.icon
                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <CategoryIcon className="w-5 h-5" />
                      <h3 className="font-semibold">{category.title}</h3>
                    </div>
                    <div className="space-y-2">
                      {category.amenities.map((amenity) => {
                        const AmenityIcon = amenity.icon
                        return (
                          <div key={amenity.id} className="flex items-start gap-3 text-sm">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <AmenityIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                <span className="text-gray-700">{amenity.name}</span>
                              </div>
                              {amenity.description && (
                                <p className="text-xs text-gray-500 mt-1 ml-6">{amenity.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1 ml-6">
                                {amenity.isFree && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                    Free
                                  </span>
                                )}
                                {amenity.hasAdditionalCharge && (
                                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                                    Additional charge
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            {moreAmenitiesCategories
              .filter((category) => ["cleaning-services", "facilities-children", "accessibility"].includes(category.id))
              .map((category) => {
                const CategoryIcon = category.icon
                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <CategoryIcon className="w-5 h-5" />
                      <h3 className="font-semibold">{category.title}</h3>
                    </div>
                    <div className="space-y-2">
                      {category.amenities.map((amenity) => {
                        const AmenityIcon = amenity.icon
                        return (
                          <div key={amenity.id} className="flex items-start gap-3 text-sm">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <AmenityIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                <span className="text-gray-700">{amenity.name}</span>
                              </div>
                              {amenity.description && (
                                <p className="text-xs text-gray-500 mt-1 ml-6">{amenity.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1 ml-6">
                                {amenity.isFree && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                    Free
                                  </span>
                                )}
                                {amenity.hasAdditionalCharge && (
                                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                                    Additional charge
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesAmenities
