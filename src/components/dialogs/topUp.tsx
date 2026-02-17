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
import { TopUpFormData, topUpSchema } from '@/validations/wallet';
import { useCreatePaymentIntent } from '@/hooks/useWallet';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import Loader from '@/components/common/loader';

interface TopUpDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPaymentSuccess: (clientSecret: string, amount: number) => void;
}

export const TopUpDialog: React.FC<TopUpDialogProps> = ({
    open,
    onOpenChange,
    onPaymentSuccess,
}) => {
    const [loadingPayment, setLoadingPayment] = useState(false);
    const createPaymentIntentMutation = useCreatePaymentIntent();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<TopUpFormData>({
        resolver: zodResolver(topUpSchema),
        defaultValues: { amount: "" }
    });

    const onSubmit = async (data: TopUpFormData) => {
        if (!data.amount) return;

        setLoadingPayment(true);
        try {
            const response = await createPaymentIntentMutation.mutateAsync(Number(data.amount));
            const secret = response?.clientSecret;

            if (secret) {
                onPaymentSuccess(secret, Number(data.amount));
                onOpenChange(false);
                reset();
            }
        } catch {
            toast({ description: "Failed to initialize payment.", variant: "destructive" });
        } finally {
            setLoadingPayment(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-t-[30px] sm:rounded-2xl p-6">
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
                <DialogHeader className='gap-1'>
                    <DialogTitle className="text-2xl font-semibold text-left text-gray-900">Top Up Wallet</DialogTitle>
                    <p className="text-slate-400 text-left text-sm">
                        Enter the amount you want to add to your wallet
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    <AuthInput
                        type="number"
                        placeholder="Amount"
                        label="Enter Amount"
                        register={register("amount")}
                        error={errors.amount?.message}
                    />
                    <Button
                        disabled={loadingPayment}
                        variant="destructive"
                        className='w-full h-12 rounded-2xl text-base'
                    >
                        {loadingPayment ? <Loader /> : "Continue to Stripe"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
