import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavourite, toggleFavourite } from "@/services/favourite";
import { toast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export const useGetFavourite = () => {
    return useQuery({
        queryKey: ["favourites"],
        queryFn: getFavourite,
    });
};

export const useToggleFavourite = () => {
    const t = useTranslations("translation");
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
            toast({
                title: t("error"),
                description: getApiErrorMessage(error, t("failedToUpdateFavourites")),
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
