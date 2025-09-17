import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getFavourite, toggleFavourite } from "@/services/favourite";
import { toast } from "@/components/ui/toast";

interface ErrorResponse {
    message: string;
}

export const useGetFavourite = () => {
    return useQuery({
        queryKey: ["favourites"],
        queryFn: getFavourite,
    });
};

export const useToggleFavourite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleFavourite,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["favourites"] });
            toast({
                title: data?.message
            });
        },
        onError: (error) => {
            const err = error as AxiosError<ErrorResponse>;
            toast({
                title: "Error",
                description: err.response?.data?.message || "Failed to update favourites.",
                variant: "destructive",
            });
        },
    });
};


export const useIsFavourite = (listingId: string) => {
  const { data } = useGetFavourite();
  return data?.favourites?.some(
    (fav: Favourite) => fav?.listing?._id === listingId
  ) ?? false; // default false if nothing
};
