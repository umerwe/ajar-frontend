import api from "@/lib/axios";

export async function getSearch(params: {name : string}) {
  const { name } = params

  const res = await api.get(`/api/marketplace-listings/search?name=${name}`);
  return res.data.data
}