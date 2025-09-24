"use client"

import { useState } from "react"
import MainCard from "@/components/cards/main-card"
import Pagination from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useGetMarketplaceListings } from "@/hooks/useListing"
import StateHandler from "@/components/common/state-handler"
import { Search } from "lucide-react"
import { Listing } from "@/types/listing"

interface ListingContentProps {
  isHome?: boolean
  initialCategory?: string
}

const ListingContent = ({ isHome, initialCategory }: ListingContentProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const limit = isHome ? 5 : 10

  const { data, isLoading, isError, isFetching } = useGetMarketplaceListings({
    page: currentPage,
    limit,
    ...(initialCategory ? { subCategory: initialCategory } : {}),
  })
  const listings = data?.listings ?? []
  const totalCount = data?.total ?? 0

  // Only filter if initialCategory exists and the subCategory is an object with matching _id
  const filteredListings = initialCategory
    ? listings.filter(
      (item: Listing) =>
        item.subCategory && typeof item.subCategory === "object" && item.subCategory._id === initialCategory,
    )
    : listings

  const totalPages = Math.ceil(totalCount / limit)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="mb-20">
      <StateHandler
        isHome={isHome}
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isFetching && filteredListings.length === 0}
        emptyTitle="No listings found"
        emptyMessage={
          initialCategory
            ? "No listings found in this category. Try browsing other categories."
            : "No listings available at the moment. Check back later for new properties."
        }
        emptyIcon={<Search className="w-16 h-16 text-gray-300 mx-auto" />}
        emptyActionHref="/listing"
      />

      {!isLoading && !isError && filteredListings.length > 0 && (
        <>
          <MainCard listings={filteredListings} />

          {!isHome && totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}

          {isHome && totalCount > filteredListings.length && (
            <div className="flex justify-center mt-4 mb-10">
              <Link href="/listing">
                <Button variant="destructive">Show more</Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ListingContent
