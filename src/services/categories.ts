import api from "@/lib/axios";

export const getSubCategories = async () => {
  const { data } = await api.get("/api/categories/list/subcategories");
  return data.data;
};