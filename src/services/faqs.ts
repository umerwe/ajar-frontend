import api from "@/lib/axios";

export async function getFaqs() {
    const { data } = await api.get("/api/faqs");
    return data.data;
}
