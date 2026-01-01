"use client";

import { useGetWallet } from '@/hooks/useWallet';
import { Transaction } from '@/types/wallet';
import { Wallet } from 'lucide-react';
import Header from '@/components/ui/header';
import SkeletonLoader from '@/components/common/skeleton-loader';

const TransactionsPage = () => {
    const { data, isLoading } = useGetWallet();

    const transactions: Transaction[] = data?.transactions || [];

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
                title='Transactions'
            />

            {
                isLoading ?
                    <SkeletonLoader
                        variant="transactions"
                    /> :
                    <div className=" bg-white sm:max-w-md sm:mx-auto font-sans text-slate-900 border rounded-md py-6 px-5 my-6 md:my-10">
                        <div className="space-y-6">
                            {transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <div key={tx._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
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
                                            <span className={`font-semibold text-base ${tx.type === 'credit' ? 'text-slate-900' : 'text-red-500'}`}>
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
                                <div className="text-center py-20 text-slate-400">
                                    No transactions found.
                                </div>
                            )}
                        </div>
                    </div>
            }
        </div>
    );
};

export default TransactionsPage;