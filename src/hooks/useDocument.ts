import { getUserDocument, removeDocumentFile } from "@/services/document";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUserDocument = () => {
    return useQuery({
        queryKey: ["user-documents"],
        queryFn: getUserDocument,
    });
};

export const useRemoveDocumentFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (fileUrl: string) => removeDocumentFile(fileUrl),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-documents"] });
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};