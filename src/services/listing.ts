import api from "@/lib/axios"

export async function getListing(params: MarketplaceListingsProps) {
  const { page, limit, subCategory } = params
  const requestParams: Record<string, string | number> = {
    zone: "68ee3c38c81f0e5497c2ab0d",
    page: page ?? "",
    limit: limit ?? "",
    all: "true"
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
