"use client"

import Link from "next/link"
import { Calendar } from "lucide-react"
import { CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Listing } from "@/types/listing"
import { formatBookingDate } from "@/utils/formatDate"

interface CardBottomProps {
  property: Listing
  bookingId?: string
  totalPrice?: number
  dates?: {
    checkIn: string
    checkOut: string
  }
}

const CardBottom = ({ property, bookingId, totalPrice, dates }: CardBottomProps) => {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const buttonStyles = "px-2 h-7 min-[500px]:h-8 min-[500px]:px-3 text-[10px] sm:text-xs"

  return (
    <>
      <CardFooter className="pb-2 pt-0 flex justify-between items-center mt-auto w-full">
        <div className="flex flex-col">
          <span className="text-xs min-[500px]:text-sm 2xl:text-base font-semibold text-gray-900 tracking-tight truncate leading-tight">
            ${(totalPrice ? totalPrice : (property?.price || 0)).toFixed(2)}/
          </span>
          <span className="text-[10px] sm:text-xs text-gray-custom font-medium leading-none">{property?.priceUnit}</span>
        </div>

        {!dates ?
          <Link
            href={
              bookingId
                ? `/booking/details/${bookingId}`
                : `/listing/${property.subCategory?._id}/${property._id}`
            }
            onClick={(e) => {
              e.stopPropagation();
              scrollToTop();
            }}
          >
            <Button
              variant="outline"
              className={buttonStyles}
            >
              View Details
            </Button>
          </Link>
          :
          null
        }
      </CardFooter>

      {
        dates &&
        <div className="pb-2 flex flex-col gap-3">
          <div className="flex items-center text-[10px] sm:text-[12px]">
            <Calendar className="sm:w-4 sm:h-4 w-3 h-3 mr-1 text-[#8fa3bf]" strokeWidth={1.5} />
            <div className="pt-[1px]">
              <span className="text-[#90A3BF] mr-2 hidden sm:inline">Dates:</span>
              <span className="text-[#858585] truncate">
                {formatBookingDate(dates.checkIn, property.priceUnit)} - {formatBookingDate(dates.checkOut, property.priceUnit)}
              </span>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default CardBottom
