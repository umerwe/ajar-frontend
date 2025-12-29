"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    EyeOff,
    Eye,
    PlusCircle,
    ArrowUpCircle,
    ChevronRight,
    Wallet
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import AuthInput from "@/components/ui/auth-input";
import Link from 'next/link';
import { TopUpFormData, topUpSchema } from '@/validations/wallet';
import { useGetWallet } from '@/hooks/useWallet';
import { Transaction } from '@/types/wallet';
import api from '@/lib/axios';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import Loader from '@/components/common/loader';
import { PaymentDialog } from '@/components/dialogs/payment';
import Header from '@/components/ui/header';
import SkeletonLoader from '@/components/common/skeleton-loader';

const WalletPage = () => {
    const { data, isLoading } = useGetWallet();

    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const [showBalance, setShowBalance] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submittedAmount, setSubmittedAmount] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<TopUpFormData>({
        resolver: zodResolver(topUpSchema),
        defaultValues: { amount: "" }
    });

    const balance = data?.balance || 0;

    const transactions: Transaction[] =
        data?.transactions
            ?.filter(
                (t: Transaction) => t.status === "succeeded" || t.status === "failed"
            )
            .slice(0, 6) || [];

    console.log("Filtered transactions:", transactions);


    const onSubmit = async (data: TopUpFormData) => {
        if (!data.amount) return

        setLoadingPayment(true)
        try {
            const response = await api.post("/api/payments/stripe/intent", {
                userAmount: data.amount,
            })
            const secret = response.data?.clientSecret

            if (secret) {
                setClientSecret(secret);
                setSubmittedAmount(Number(data.amount));
                setIsPaymentOpen(true)
            }
        } catch {
            toast({ description: "Failed to initialize payment.", variant: "destructive" })
        } finally {
            setLoadingPayment(false)
        }
        console.log("Proceeding to Stripe with amount:", data.amount);
        setIsDialogOpen(false);
        reset();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).replace(/:(\d{2}) /, ':$1 ');
    };

    return (
        <div>
            <Header
                title='My Wallet'
            />
            {
                isLoading ?
                    <SkeletonLoader
                        variant="wallet"
                    /> :
                    <div className=" bg-white max-w-md mx-auto font-sans text-slate-900 border rounded-md py-8">
                        {/* Balance Section */}
                        <section className="text-center px-4">
                            <p className="text-gray-900 font-medium mb-2">Your Balance</p>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-4xl font-semibold text-header">
                                    {showBalance ? `$${balance.toFixed(2)}` : "****"}
                                </span>
                                <button
                                    onClick={() => setShowBalance(!showBalance)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                                >
                                    {showBalance ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                                </button>
                            </div>
                        </section>

                        {/* Action Buttons */}
                        <section className="flex justify-around mt-10 px-6">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                        <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-[#00D1A0]/10 transition-colors">
                                            <PlusCircle className="w-7 h-7 text-[#00D1A0]" />
                                        </div>
                                        <span className="text-sm font-semibold">Top Up</span>
                                    </div>
                                </DialogTrigger>
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
                                            {loadingPayment ? (
                                                <Loader />
                                            ) : (
                                                "Continue to Stripe"
                                            )}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-[#00D1A0]/10 transition-colors">
                                    <ArrowUpCircle className="w-7 h-7 text-[#00D1A0]" />
                                </div>
                                <span className="text-sm font-semibold">Withdraw</span>
                            </div>
                        </section>

                        {/* Latest Transactions */}
                        <section className="mt-12 px-5">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-semibold">Latest Transactions</h2>
                                <Link
                                    href={'/wallet/transactions'}
                                    className="text-[#00D1A0] text-sm flex items-center gap-1">
                                    See All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {transactions.length > 0 ? (
                                    transactions.map((tx) => (
                                        <div key={tx._id} className="flex items-center justify-between py-2 group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Wallet className="w-6 h-6 text-[#00D1A0]" />
                                                </div>
                                                <div>
                                                    {/* <h3 className="font-medium text-slate-800 text-base">
                                                        {tx.type === 'credit' ? 'Wallet Credited' : 'Wallet Debited'}
                                                    </h3> */}
                                                    <h3 className="font-medium text-slate-800 text-base">
                                                        Wallet Credited
                                                    </h3>
                                                    <p className="text-xs text-slate-400 font-medium">
                                                        {formatDate(tx.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* <div className="text-right">
                                                <span className={`font-medium text-base  ${tx.type === 'credit' ? 'text-slate-900' : 'text-red-500'}`}>
                                                    {tx.type === 'credit' ? '+' : '-'}${tx.amount}
                                                </span>
                                            </div> */}
                                            <div className="text-right">
                                                <span className={`font-medium text-base text-slate-900`}>
                                                    +${tx.amount}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-400 text-sm">No transactions found</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <PaymentDialog
                            open={isPaymentOpen}
                            onOpenChange={setIsPaymentOpen}
                            clientSecret={clientSecret}
                            amount={submittedAmount as number}
                        />
                    </div>
            }
        </div>
    );
};

export default WalletPage;