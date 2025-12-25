import {
    deductWallet, getBankAccountDetails, getWallet, addBankAccount,
    updateBankAccount,
    deleteBankAccount,
} from "@/services/wallet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useGetBankAccountDetails = () => {
    return useQuery({
        queryKey: ["bank-account"],
        queryFn: getBankAccountDetails,
    });
};

export const useAddBankAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addBankAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bank-account"] });
        },
    });
};

// UPDATE
export const useUpdateBankAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateBankAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bank-account"] });
        },
    });
};

// DELETE
export const useDeleteBankAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBankAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bank-account"] });
        },
    });
};