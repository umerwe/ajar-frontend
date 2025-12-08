import { getArticles, getArticle } from "@/services/articles";
import { useQuery } from "@tanstack/react-query";

export function useGetArticles(page: number,search ?: string) {
    return useQuery({
        queryKey: ["articles", page,search],
        queryFn: () => getArticles(page,search),
    });
}

export function useGetArticle(id?: string) {
    return useQuery({
        queryKey: ["article", id],
        queryFn: () => getArticle(id!),
        enabled: Boolean(id), // 👈 only run when id is truthy
    });
}