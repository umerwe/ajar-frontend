"use client"

import { useState } from "react"
import MainCard from "@/components/cards/main-card"
import Pagination from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useGetMarketplaceListings } from "@/hooks/useListing"
import { Listing } from "@/types/listing"
import SkeletonLoader from "./common/skeleton-loader"
import NotFound from "./common/not-found"
import Error from "./common/error"

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
  });

  const listings = data?.listings ?? []
  const totalCount = data?.total ?? 0

  if (isLoading || isFetching) {
    return <SkeletonLoader count={isHome ? 5 : 10} />;
  }

  if (isError) {
    return <Error />;
  }

  if (!listings || listings.length === 0) {
    return <NotFound />;
  }

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
      <MainCard
        listings={filteredListings}
      />

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
    </div>
  )
}

export default ListingContent
