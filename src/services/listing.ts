import api from "@/lib/axios"

export async function getListing(params: MarketplaceListingsProps) {
  const { page, limit, subCategory, zone, category, minPrice, maxPrice } = params
  const requestParams: Record<string, string | number> = {
    zone: zone ?? "",
    page: page ?? "1",
    limit: limit ?? "10",
    subCategory: category ?? "",
    all: "true",
    minPrice: minPrice ?? "0",
    maxPrice: maxPrice ?? "1000000",
  }

  if (subCategory) {
    requestParams.subCategory = subCategory
  }
  const { data } = await api.get("/api/marketplace-listings", {
    params: requestParams,
  });
  return data.data
}

export async function getList(id: string) {
  const { data } = await api.get(`/api/marketplace-listings/${id}`);
  return data.data
}
