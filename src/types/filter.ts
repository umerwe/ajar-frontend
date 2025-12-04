export interface ReportPayload {
    booking: string;           // booking _id
    issueType: string;         // issue type text
    damagedCharges: string;    // amount
    rentalText: string;        // rental text
    attachments?: File;        // optional file
}

export interface PriceRangeSliderProps {
  priceRange: number[]
  onValueChange: (values: number[]) => void
}

export interface FilterState {
  category: string
  location: string
  priceRange: number[]
}

export interface FilterPageProps {
  location?: string
  minPrice?: string
  maxPrice?: string
  category?: string
}

export interface FilterContentProps {
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