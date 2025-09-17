import { getSearch } from "@/services/search";
import { useQuery } from "@tanstack/react-query";

export function useSearch(params: { name: string }, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["search", params],
    queryFn: () => getSearch(params),
    enabled: options?.enabled,
  })
}
