"use client"

import { useGetFavourite } from "@/hooks/useFavourite"
import MainCard from "@/components/cards/main-card"
import { Heart } from "lucide-react"
import StateHandler from "@/components/common/state-handler"

const SavedPage = () => {
  const { data = [], isLoading, isError } = useGetFavourite();
  const listings = data?.favourites?.map((favourite: Favourite) => favourite.listing).filter(Boolean) || []
  const count = data.count || 0
  const countStatus = count > 1 ? "products" : "product"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8">
        <div className="mb-5 px-5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">My Favourites</h1>
          </div>
          <p className="text-gray-600 text-sm">
            Total {count} {countStatus}
          </p>
        </div>

        <StateHandler
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && listings.length === 0}
          emptyMessage="Start exploring properties and save your favorites by clicking the heart icon."
          emptyIcon={<Heart className="w-16 h-16 text-gray-300 mx-auto" />}
          emptyActionText="Browse Listings"
          emptyActionHref="/listing"
        />

        {!isLoading && !isError && listings.length > 0 && <MainCard listings={listings} showRemoveButton={true} />}
      </div>
    </div>
  )
}

export default SavedPage
