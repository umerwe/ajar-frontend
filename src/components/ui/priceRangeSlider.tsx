import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { PriceRangeSliderProps } from "@/types/filter"

export const PriceRangeSlider = ({ priceRange, onValueChange }: PriceRangeSliderProps) => (
    <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">Price Range</Label>

        <div className="text-sm text-gray-600 font-semibold text-center py-2">
            ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
        </div>

        <Slider
            value={priceRange}
            onValueChange={onValueChange}
            max={100000}
            min={0}
            step={100}
            className="w-full"
        />

        <div className="flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span>$100,000</span>
        </div>
    </div>
)