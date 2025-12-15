"use client"
import { useState, useEffect, useCallback } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetZones } from "@/hooks/useZone"
import { useGetMarketplaceListings } from "@/hooks/useListing"
import { useRouter } from "next/navigation"
import MainCard from "../cards/main-card"
import Pagination from "@/components/ui/pagination"
import SkeletonLoader from "../common/skeleton-loader"
import NotFound from "../common/not-found"
import { useSubCategories } from "@/hooks/useSubCategory"
import type { FilterContentProps, FilterPageProps, FilterState } from "@/types/filter"
import { FilterContent } from "./filter/filterContent"

const FilterPage = ({ location, minPrice, maxPrice, category }: FilterPageProps) => {
  const router = useRouter()
  const { data, isLoading } = useGetZones()
  const { data: subCategories, isLoading: isSubCategoriesLoading } = useSubCategories()
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 9

  const {
    data: listingData,
    isLoading: isListing,
    isRefetching,
  } = useGetMarketplaceListings({
    zone: location,
    minPrice: minPrice,
    maxPrice: maxPrice,
    category: category,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  })

  const listings = listingData?.listings || []
  const total = listingData?.total || 0
  const zones = data?.zones || []

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const [filters, setFilters] = useState<FilterState>({
    category: category || "",
    location: location || "",
    priceRange: [minPrice ? Number.parseInt(minPrice) : 0, maxPrice ? Number.parseInt(maxPrice) : 100000],
  })

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: category || "",
      location: location || "",
      priceRange: [minPrice ? Number.parseInt(minPrice) : 0, maxPrice ? Number.parseInt(maxPrice) : 100000],
    }))
    setCurrentPage(1)
  }, [location, minPrice, maxPrice, category])

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
      priceRange: [0, 100000],
    })
    setCurrentPage(1)
    router.push("/?minPrice=0&maxPrice=100000")
  }, [router])

  const handleApply = useCallback(() => {
    const params = new URLSearchParams()

    if (filters.location) params.append("zone", filters.location)
    if (filters.priceRange) {
      params.append("minPrice", filters.priceRange[0].toString())
      params.append("maxPrice", filters.priceRange[1].toString())
    }
    if (filters.category) params.append("category", filters.category)

    setCurrentPage(1)
    router.push(`/?${params.toString()}`)
    setIsFilterDialogOpen(false)
  }, [filters, router])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

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
    <div className="max-w-[1400px] mx-auto">
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
        <DialogContent className="max-w-xs">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Filter Properties</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-96">
            <FilterContent {...filterContentProps} />
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col mx-4 md:mx-8 md:flex-row gap-4 md:gap-6 mt-20 md:my-8">
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
            <div className="flex flex-col gap-6">
              <MainCard listings={listings} type="filter" />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterPage
