"use client"

import { useGetFavourite } from "@/hooks/useFavourite"
import MainCard from "@/components/cards/main-card"
import SkeletonLoader from "@/components/common/skeleton-loader"
import Error from "@/components/common/error"
import Header from "@/components/ui/header"
import NotFound from "@/components/common/not-found"

const FavouritesPage = () => {
  const { data, isLoading, isError } = useGetFavourite()

  const listings =
    data?.favourites
      ?.map((favourite: Favourite) => favourite.listing)
      .filter(Boolean) || []

  if (isError) {
    return <Error />
  }

  return (
    <div>
      <Header title="My Favourites" />

      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="pt-1 pb-8">
          {listings.length === 0 ? (
            <NotFound />
          ) : (
            <MainCard listings={listings} showRemoveButton={true} />
          )}
        </div>
      )}
    </div>
  )
}

export default FavouritesPage
