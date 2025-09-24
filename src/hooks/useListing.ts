import { useQuery } from "@tanstack/react-query"
import { getList, getListing } from "@/services/listing"

export function useGetMarketplaceListings(params: MarketplaceListingsProps) {
  return useQuery({
    queryKey: ["marketplaceListings", params],
    queryFn: () => getListing(params),
    placeholderData: (prevData) => prevData,
  })
}


export function useGetMarketplaceListing(id?: string) {
  return useQuery({
    queryKey: ["marketplacelisting", id],
    queryFn: () => getList(id as string),
  });
}
