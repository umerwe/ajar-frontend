import { MapPin, RotateCcw, Grid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { capitalizeWords } from "@/utils/capitalizeWords"
import { PriceRangeSlider } from "../../ui/priceRangeSlider"
import { FilterContentProps } from "@/types/filter"

export const FilterContent = ({
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
    <div className="space-y-6" >
        {/* Categories */}
        < div className="space-y-3" >
            <Label className="text-sm font-medium text-gray-700" > Category </Label>
            < div className="relative" >
                <Grid className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-aqua z-10 pointer-events-none" />
                <Select value={filters.category} onValueChange={handleCategoriesChange} >
                    <SelectTrigger className="w-full pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500" >
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            isLoadingSubCategories ? (
                                <SelectItem value="loading" disabled > Loading categories...</SelectItem>
                            ) : subCategories?.length === 0 ? (
                                <SelectItem value="no-categories" disabled > No categories available </SelectItem>
                            ) : (
                                subCategories?.map((subCategory) => (
                                    <SelectItem key={subCategory._id} value={subCategory._id as string} >
                                        {capitalizeWords(subCategory.name)}
                                    </SelectItem>
                                ))
                            )}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Location */}
        <div className="space-y-3" >
            <Label htmlFor="location" className="text-sm font-medium text-gray-700" >
                Location
            </Label>
            < div className="relative" >
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-aqua z-10 pointer-events-none" />
                <Select value={filters.location} onValueChange={handleLocationChange} >
                    <SelectTrigger className="w-full pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500" >
                        <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            isLoadingZones ? (
                                <SelectItem value="loading" disabled > Loading zones...</SelectItem>
                            ) : zones?.length === 0 ? (
                                <SelectItem value="no-zones" disabled > No zones available </SelectItem>
                            ) : (
                                zones.map((zone) => (
                                    <SelectItem key={zone._id} value={zone._id as string} >
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
        < div className="flex items-center gap-3 pt-2 flex-wrap" >
            <Button
                variant="ghost"
                onClick={handleReset}
                className="flex-1 min-w-32 items-center gap-2 text-gray-400 hover:text-aqua/80 hover:rounded-full hover:bg-aqua/10"
            >
                <RotateCcw className="h-4 w-4 text-aqua" />
                Reset all
            </Button>
            < Button
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