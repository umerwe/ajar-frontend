import { deductWallet, getWallet } from "@/services/wallet";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetWallet = () => {
    return useQuery({
        queryKey: ["wallet"],
        queryFn: getWallet,
    });
};

export const useDeductWallet = () => {
    return useMutation({
        mutationFn: deductWallet,
    });
};