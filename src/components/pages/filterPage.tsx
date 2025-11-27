"use client"
import { useState, useEffect, useCallback } from "react"
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
import { useSubCategories } from "@/hooks/useSubCategory"
import { capitalizeWords } from "@/utils/capitalizeWords"

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

interface PriceRangeSliderProps {
  priceRange: number[]
  onValueChange: (values: number[]) => void
}

const PriceRangeSlider = ({ priceRange, onValueChange }: PriceRangeSliderProps) => (
  <div className="space-y-4">
    <Label className="text-sm font-medium text-gray-700">Price Range</Label>

    <div className="text-sm text-gray-600 font-semibold text-center py-2">
      ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
    </div>

    <Slider
      value={priceRange}
      onValueChange={onValueChange}
      max={10000}
      min={0}
      step={100}
      className="w-full"
    />

    <div className="flex justify-between text-xs text-gray-500">
      <span>$0</span>
      <span>$10,000</span>
    </div>
  </div>
)

interface FilterContentProps {
  filters: FilterState
  zones: Zone[]
  subCategories: SubCategory[]
  isLoadingZones: boolean
  isLoadingSubCategories: boolean
  isListing: boolean
  isRefetching: boolean
  handleCategoriesChange: (value: string) => void
  handleLocationChange: (value: string) => void
  handlePriceRangeChange: (values: number[]) => void
  handleReset: () => void
  handleApply: () => void
}

const FilterContent = ({
  filters,
  zones,
  subCategories,
  isLoadingZones,
  isLoadingSubCategories,
  isListing,
  isRefetching,
  handleCategoriesChange,
  handleLocationChange,
  handlePriceRangeChange,
  handleReset,
  handleApply,
}: FilterContentProps) => (
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
            {isLoadingSubCategories ? (
              <SelectItem value="loading" disabled>Loading categories...</SelectItem>
            ) : subCategories?.length === 0 ? (
              <SelectItem value="no-categories" disabled>No categories available</SelectItem>
            ) : (
              subCategories?.map((subCategory) => (
                <SelectItem key={subCategory._id} value={subCategory._id as string}>
                  {capitalizeWords(subCategory.name)}
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
            {isLoadingZones ? (
              <SelectItem value="loading" disabled>Loading zones...</SelectItem>
            ) : zones?.length === 0 ? (
              <SelectItem value="no-zones" disabled>No zones available</SelectItem>
            ) : (
              zones.map((zone) => (
                <SelectItem key={zone._id} value={zone._id as string}>
                  {capitalizeWords(zone.name)}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Price Range */}
    <PriceRangeSlider
      priceRange={filters.priceRange}
      onValueChange={handlePriceRangeChange}
    />

    {/* Actions */}
    <div className="flex items-center gap-3 pt-2 flex-wrap">
      <Button
        variant="ghost"
        onClick={handleReset}
        className="flex-1 min-w-32 items-center gap-2 text-gray-400 hover:text-aqua/80 hover:rounded-full hover:bg-aqua/10"
      >
        <RotateCcw className="h-4 w-4 text-aqua" />
        Reset all
      </Button>
     <Button
  onClick={handleApply}
  disabled={isListing || isRefetching}
  variant="destructive"
  className="flex-1 min-w-32 disabled:cursor-not-allowed"
>
  Apply
</Button>

    </div>
  </div>
)

// 3. MAIN COMPONENT: PropertyFilter
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
    priceRange: [minPrice ? Number.parseInt(minPrice) : 0, maxPrice ? Number.parseInt(maxPrice) : 10000],
  })

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: category || "",
      location: location || "",
      priceRange: [minPrice ? Number.parseInt(minPrice) : 0, maxPrice ? Number.parseInt(maxPrice) : 10000],
    }))
  }, [location, minPrice, maxPrice, category])
  
  // Use useCallback to ensure handler functions are stable references
  const handleCategoriesChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, category: value }))
  }, [])

  const handleLocationChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, location: value }))
  }, [])

  const handlePriceRangeChange = useCallback((values: number[]) => {
    setFilters((prev) => ({ ...prev, priceRange: values }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters({
      category: "",
      location: "",
      priceRange: [0, 10000],
    })
    router.push("/?minPrice=0&maxPrice=10000")
  }, [router])

  const handleApply = useCallback(() => {
    const params = new URLSearchParams()

    if (filters.location) params.append("zone", filters.location)
    if (filters.priceRange) {
      params.append("minPrice", filters.priceRange[0].toString())
      params.append("maxPrice", filters.priceRange[1].toString())
    }
    if (filters.category) params.append("category", filters.category)

    router.push(`/?${params.toString()}`)
    setIsFilterDialogOpen(false)
  }, [filters, router])


  // Props object to pass to the hoisted FilterContent
  const filterContentProps: FilterContentProps = {
    filters,
    zones,
    subCategories: subCategories || [],
    isLoadingZones: isLoading,
    isLoadingSubCategories: isSubCategoriesLoading,
    isListing,
    isRefetching,
    handleCategoriesChange,
    handleLocationChange,
    handlePriceRangeChange,
    handleReset,
    handleApply,
  }

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
            <FilterContent {...filterContentProps} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Main layout */}
      <div className="flex flex-col mx-4 md:mx-8 md:flex-row gap-4 md:gap-6 my-16 md:my-8">
        <div className="hidden md:block w-full md:w-80 bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden h-fit md:sticky md:top-6">
          <h2 className="text-xl font-semibold px-6 pt-6">Filter</h2>
          <div className="p-6">
            <FilterContent {...filterContentProps} />
          </div>
        </div>

        <div className="w-full md:flex-1">
          {isListing || isRefetching ? (
            <SkeletonLoader count={6} type="filter" />
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