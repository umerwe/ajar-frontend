import { CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import Link from "next/link"
import { Listing } from "@/types/listing"

const CardBottom = ({ property, bookingId, totalPrice }: { property: Listing, bookingId?: string, totalPrice?: number }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <CardFooter className="pl-2 sm:mb-2 min-[500px]:px-3 pb-2 pt-0 flex justify-between items-center mt-2">
      <div className="flex flex-col">
        <span className="text-sm min-[500px]:text-sm 2xl:text-base font-bold text-gray-900">
          ${
            Math.round(
              totalPrice
                ? totalPrice
                : property.price
            )
          }.00/
        </span>
        <span className="text-xs text-gray-custom -mt-1 font-medium">day</span>
      </div>

      <Link
        href={
          bookingId
            ? `/booking/details/${bookingId}`
            : `/listing/${property.subCategory?._id}/${property._id}`
        }
        onClick={scrollToTop}
      >
        <Button variant="outline" className="px-3.5 h-7.5 min-[500px]:h-9 min:[500px]:px-4 text-xs bg-transparent">
          View Details
        </Button>
      </Link>
    </CardFooter>
  )
}

export default CardBottom
