"use client"
import { useState, useEffect } from "react"
import { MapPin, RotateCcw, Filter, Grid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetZones } from "@/hooks/useZone"
import { useGetMarketplaceListings } from "@/hooks/useListing"
import { useRouter } from "next/navigation"
import MainCard from "../cards/main-card"
import SkeletonLoader from "../common/skeleton-loader"
import NotFound from "../common/not-found"
import Loader from "../common/loader"
import { useSubCategories } from "@/hooks/useSubCategory"

interface FilterState {
  category: string
  location: string
  priceRange: number[]
}

interface PropertyFilterProps {
  location?: string
  minPrice?: string
  maxPrice?: string
  category?: string
}

const PropertyFilter = ({ location, minPrice, maxPrice, category }: PropertyFilterProps) => {
  const router = useRouter()
  const { data, isLoading } = useGetZones();
  const { data: subCategories, isLoading: isSubCategoriesLoading } = useSubCategories();
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

  const { data: listingData, isLoading: isListing, isRefetching } = useGetMarketplaceListings({
    zone: location,
    minPrice: minPrice,
    maxPrice: maxPrice,
    category: category,
  })
  const listings = listingData?.listings
  const zones = data?.zones || []

  const [filters, setFilters] = useState<FilterState>({
    category: category || "",
    location: location || "",
    priceRange: [minPrice ? Number.parseInt(minPrice) : 1200, maxPrice ? Number.parseInt(maxPrice) : 3000],
  })

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: category || "",
      location: location || "",
      priceRange: [minPrice ? Number.parseInt(minPrice) : 1200, maxPrice ? Number.parseInt(maxPrice) : 3000],
    }))
  }, [location, minPrice, maxPrice, category])

  const handleCategoriesChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }))
  }

  const handleLocationChange = (value: string) => {
    setFilters((prev) => ({ ...prev, location: value }))
  }

  const handlePriceRangeChange = (values: number[]) => {
    setFilters((prev) => ({ ...prev, priceRange: values }))
  }

  const handleReset = () => {
    setFilters({
      category: "",
      location: "",
      priceRange: [1200, 3000],
    })
  }

  const handleApply = () => {
    const params = new URLSearchParams()

    if (filters.location) params.append("zone", filters.location)
    if (filters.priceRange) {
      params.append("minPrice", filters.priceRange[0].toString())
      params.append("maxPrice", filters.priceRange[1].toString())
    }
    if (filters.category) params.append("category", filters.category)

    router.push(`/?${params.toString()}`)
    setIsFilterDialogOpen(false)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Category</Label>
        <div className="relative">
          <Grid className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-aqua z-10 pointer-events-none" />
          <Select value={filters.category} onValueChange={handleCategoriesChange}>
            <SelectTrigger className="w-full pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {isSubCategoriesLoading ? (
                <SelectItem value="loading" disabled>Loading categories...</SelectItem>
              ) : subCategories?.length === 0 ? (
                <SelectItem value="no-categories" disabled>No categories available</SelectItem>
              ) : (
                subCategories?.map((subCategory: SubCategory) => (
                  <SelectItem key={subCategory._id} value={subCategory._id as string}>
                    {subCategory.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <Label htmlFor="location" className="text-sm font-medium text-gray-700">
          Location
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-aqua z-10 pointer-events-none" />
          <Select value={filters.location} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-full pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>Loading zones...</SelectItem>
              ) : zones?.length === 0 ? (
                <SelectItem value="no-zones" disabled>No zones available</SelectItem>
              ) : (
                zones.map((zone: Zone) => (
                  <SelectItem key={zone._id} value={zone._id as string}>
                    {zone.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">Price Range</Label>

        <div className="text-sm text-gray-600 font-semibold text-center py-2">
          ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
        </div>

        <Slider
          value={filters.priceRange}
          onValueChange={handlePriceRangeChange}
          max={5000}
          min={0}
          step={100}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>$0</span>
          <span>$5,000</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 flex-wrap">
        <Button
          variant="ghost"
          onClick={handleReset}
          className="flex-1 min-w-32 items-center gap-2 text-gray-400 hover:text-aqua/80 hover:bg-aqua/10"
        >
          <RotateCcw className="h-4 w-4 text-aqua" />
          Reset all
        </Button>
        <Button
          onClick={handleApply}
          disabled={isListing || isRefetching}
          variant="destructive"
          className="flex-1 min-w-32"
        >
          {isListing || isRefetching ? <Loader /> : "Apply"}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <div className="md:hidden absolute top-24 right-4 mb-4 flex">
        <Button
          onClick={() => setIsFilterDialogOpen(true)}
          variant="outline"
          className="max-w-44 gap-2 text-header hover:bg-aqua/10 border-aqua"
        >
          <Filter className="h-4 w-4 text-aqua" />
          Filters
        </Button>
      </div>

      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Filter Properties</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-96">
            <FilterContent />
          </div>
        </DialogContent>
      </Dialog>

      {/* Main layout */}
      <div className="flex flex-col mx-4 md:mx-8 md:flex-row gap-4 md:gap-6 mt-16 md:mt-8">
        <div className="hidden md:block w-full md:w-80 bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden h-fit md:sticky md:top-6">
          <h2 className="text-xl font-semibold px-6 pt-6">Filter</h2>
          <div className="p-6">
            <FilterContent />
          </div>
        </div>

        <div className="w-full md:flex-1">
          {isListing || isRefetching ? (
            <SkeletonLoader count={3} type="filter" />
          ) : listings?.length === 0 && !isListing ? (
            <NotFound type="filter" />
          ) : (
            <MainCard listings={listings} type="filter" />
          )}
        </div>
      </div>
    </>
  )
}

export default PropertyFilter