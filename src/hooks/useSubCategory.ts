import { getSubCategories } from "@/services/categories";
import { useQuery } from "@tanstack/react-query";

export const useSubCategories = () => {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: getSubCategories,
  });
};