import { useQuery } from "@tanstack/react-query"
import { getList, getListing } from "@/services/listing"

export function useGetMarketplaceListings(params: MarketplaceListingsProps) {
  return useQuery({
    queryKey: [
      "marketplaceListings",
      params.page,
      params.limit,
      params.subCategory,
      params.category,
      params.currentPage,
      params.zone,
      params.minPrice,
      params.maxPrice,
    ],
    queryFn: () => getListing(params),
    placeholderData: (prevData) => prevData,
  });
}


export function useGetMarketplaceListing(id?: string) {
  return useQuery({
    queryKey: ["marketplacelisting", id],
    queryFn: () => getList(id as string),
  });
}
