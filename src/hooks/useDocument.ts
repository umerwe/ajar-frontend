import { getUserDocument } from "@/services/document";
import { useQuery } from "@tanstack/react-query";

export const useGetUserDocument = () => {
    return useQuery({
        queryKey: ["user-documents"],
        queryFn: getUserDocument,
    });
};