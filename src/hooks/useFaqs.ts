import { getFaqs } from "@/services/faqs";
import { useQuery } from "@tanstack/react-query";

export function useGetFaqs() {
    return useQuery({
        queryKey: ["faqs"],
        queryFn: getFaqs,
    });
}
