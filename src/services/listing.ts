import api from "@/lib/axios"

export async function getListing(params: MarketplaceListingsProps) {
  const { page, limit, subCategory, zone, category } = params
  const requestParams: Record<string, string | number> = {
    zone: zone ?? "68ee3c38c81f0e5497c2ab0d",
    page: page ?? "1",
    limit: limit ?? "10",
    category: category ?? "",
    all: "true",
    minPrice: "0",
    maxPrice: "1000000",
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
