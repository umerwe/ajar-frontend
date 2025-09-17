import api from "@/lib/axios"

export async function getListing(params: MarketplaceListingsProps) {
  const { page, limit, subCategory } = params

  const requestParams: Record<string, string | number> = {
    zone: "68934f22cb0f4ba646a17026",
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
