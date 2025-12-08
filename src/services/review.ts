import api from "@/lib/axios";

interface ReviewRequest {
    bookingId: string;
    stars: number;
    comment: string;
}

export async function sendReview(payload: ReviewRequest) {
    const { data } = await api.post("/api/reviews", payload);
    return data.data;
}