"use client"

import { useGetFavourite } from "@/hooks/useFavourite"
import MainCard from "@/components/cards/main-card"
import SkeletonLoader from "@/components/common/skeleton-loader";
import Error from "@/components/common/error";
import Header from "@/components/pages/listing-details/header";
import NotFound from "@/components/common/not-found";

const FavouritesPage = () => {
  const { data = [], isLoading, isError, isFetching } = useGetFavourite();
  const listings = data?.favourites?.map((favourite: Favourite) => favourite.listing).filter(Boolean) || []

  if (isLoading || isFetching) {
    return <SkeletonLoader isFav={true} />
  }

  if (isError) {
    return <Error />
  }

  return (
    <div className="min-h-screen">
      <div className="px-6">
        <Header
          title="My Favourites"
        />
      </div>
      <div className="pt-1 pb-8">
        {(listings?.length === 0 && !isLoading) ? <NotFound type="favourite" /> : <MainCard listings={listings} showRemoveButton={true} />}
      </div>
    </div>
  )
}

export default FavouritesPage
