"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import AuthInput from "@/components/ui/auth-input";
import { WithdrawFormData, withdrawSchema } from '@/validations/wallet';
import { useWithdraw } from '@/hooks/useWallet';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import Loader from '@/components/common/loader';

interface WithdrawDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onWithdrawSuccess: () => void;
}

export const WithdrawDialog: React.FC<WithdrawDialogProps> = ({
    open,
    onOpenChange,
    onWithdrawSuccess,
}) => {
    const [loadingWithdraw, setLoadingWithdraw] = useState(false);
    const withdrawMutation = useWithdraw();

    const {
        register: registerWithdraw,
        handleSubmit: handleWithdrawSubmit,
        formState: { errors: withdrawErrors },
        reset: resetWithdraw
    } = useForm<WithdrawFormData>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: { amount: "" }
    });

    const onWithdraw = async (data: WithdrawFormData) => {
        setLoadingWithdraw(true);
        try {
            await withdrawMutation.mutateAsync(Number(data.amount));

            toast({
                description: "Withdrawal initiated successfully.",
            });

            onOpenChange(false);
            resetWithdraw();
            onWithdrawSuccess();

        } catch (err: any) {
            console.log(err);
            toast({
                description: err?.response?.data?.error || "Withdrawal failed.",
                variant: "destructive",
            });
        } finally {
            setLoadingWithdraw(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-t-[30px] sm:rounded-2xl p-6">
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
                <DialogHeader className='gap-1'>
                    <DialogTitle className="text-2xl font-semibold text-left text-gray-900">
                        Withdraw Funds
                    </DialogTitle>
                    <p className="text-slate-400 text-left text-sm">
                        Enter amount to withdraw to your bank
                    </p>
                </DialogHeader>

                <form onSubmit={handleWithdrawSubmit(onWithdraw)} className="space-y-6 mt-4">
                    <AuthInput
                        type="number"
                        placeholder="Amount"
                        label="Enter Amount"
                        register={registerWithdraw("amount")}
                        error={withdrawErrors.amount?.message}
                    />

                    <Button
                        type="submit"
                        disabled={loadingWithdraw}
                        variant="destructive"
                        className='w-full h-12 rounded-2xl text-base'
                    >
                        {loadingWithdraw ? <Loader /> : "Withdraw"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
