import api from "@/lib/axios";

export const getCategories = async () => {
  const {data} = await api.get("/api/categories?type=SubCategory");

  return data.data.categories;
};