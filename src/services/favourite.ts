import api from "@/lib/axios";

export const getFavourite = async () => {
  const { data } = await api.get("/api/favourites");
  return data;
};

export const toggleFavourite = async (listingId: string) => {
  const { data } = await api.patch(`/api/favourites`, { listingId });
  return data;
};

