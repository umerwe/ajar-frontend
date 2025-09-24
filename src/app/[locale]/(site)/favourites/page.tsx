"use client"

import { useGetFavourite } from "@/hooks/useFavourite"
import MainCard from "@/components/cards/main-card"
import SkeletonLoader from "@/components/common/skeleton-loader";
import Error from "@/components/common/error";

const FavouritesPage = () => {
  const { data = [], isLoading, isError } = useGetFavourite();
  const listings = data?.favourites?.map((favourite: Favourite) => favourite.listing).filter(Boolean) || []
  const count = data.count || 0
  const countStatus = count > 1 ? "products" : "product"

  if (isLoading) {
    return <SkeletonLoader isFav={true} />
  }

  if (isError) {
    return <Error />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="mb-5 px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">My Favourites</h1>
          </div>
          <p className="text-gray-600 text-sm">
            Total {count} {countStatus}
          </p>
        </div>

        <MainCard listings={listings} showRemoveButton={true} />
      </div>
    </div>
  )
}

export default FavouritesPage
