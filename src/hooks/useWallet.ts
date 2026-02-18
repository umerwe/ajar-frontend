import {
    deductWallet, getBankAccountDetails, getWallet, addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    createPaymentIntent,
    withdraw,
    checkBankConnectionStatus,
    createConnectedAccount,
    confirmConnectedAccount,
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

export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: createPaymentIntent,
    });
};

export const useWithdraw = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: withdraw,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
        },
    });
};

export const useCheckBankConnectionStatus = () => {
    return useQuery({
        queryKey: ["bank-connection-status"],
        queryFn: checkBankConnectionStatus,
        retry: false,
    });
};

export const useCreateConnectedAccount = () => {
    return useMutation({
        mutationFn: createConnectedAccount,
    });
};

export const useConfirmConnectedAccount = () => {
  return useMutation({
    mutationFn: confirmConnectedAccount,
  });
};