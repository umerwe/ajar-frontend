import api from "@/lib/axios";

export async function getArticles(page: number, search?: string) {
    const { data } = await api.get("/api/articles", {
        params: {
            page: page,
            search: search
        },
    });

    return data.data;
}

export async function getArticle(id: string) {
    const { data } = await api.get(`/api/articles/${id}`);
    return data.data
}
