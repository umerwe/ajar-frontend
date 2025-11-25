"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RatingDialog } from "./rating-dialog"
import { getActionDetails } from "@/lib/actions/getAction"
import { Listing } from "@/types/listing"


const PricingActions = ({ property, category_id, id }: { property: Listing, category_id: string, id: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { label, link } = getActionDetails("Approved");

  return (
    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between items-start sm:items-center md:items-start lg:items-center gap-3 md:gap-4">
      {/* Price Display */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-xl sm:text-2xl font-semibold border-b border-dotted border-gray-400 pb-1">
          ${property.price}
        </span>
      </div>

      {/* Action Button */}
      {label === "Rate Owner" ? (
        <Button
          onClick={() => setIsOpen(true)}
          variant="destructive"
          className="w-full sm:w-auto md:w-full lg:w-auto px-7"
        >
          {label}
        </Button>
      ) : (
        <Link href={`/listing/${category_id}/${id}/${link}`}>
          <Button
            variant="destructive"
            className="w-full sm:w-auto md:w-full lg:w-auto px-7"
          >
            {label}
          </Button>
        </Link>
      )}

      {/* Dialog */}
      <RatingDialog open={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}

export default PricingActions
