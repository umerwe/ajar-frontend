"use client";

import Link from 'next/link';
import { ChevronRight, Wallet } from 'lucide-react';
import { Transaction } from '@/types/wallet';

interface WalletTransactionsProps {
    transactions: Transaction[];
}

export const WalletTransactions: React.FC<WalletTransactionsProps> = ({ transactions }) => {
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
                {transactions?.length > 0 ? (
                    transactions?.slice(0, 5)?.map((tx: Transaction) => (
                        <div key={tx._id} className="flex items-center justify-between py-2 group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Wallet className={`w-6 h-6 ${tx.status === 'failed' ? 'text-slate-400' : 'text-[#00D1A0]'}`} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-800 text-base">
                                        {tx.status === 'failed'
                                            ? 'Transaction Failed'
                                            : tx.source === 'withdraw'
                                                ? 'Withdrawal'
                                                : tx.type === 'credit'
                                                    ? 'Wallet Credited'
                                                    : 'Wallet Debited'}
                                    </h3>

                                    <p className="text-xs text-slate-400 font-medium">
                                        {formatDate(tx.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`font-medium text-base ${tx.status === 'failed' || tx.type === 'debit'
                                    ? 'text-red-500'
                                    : 'text-slate-900'
                                    }`}>
                                    {tx.status !== 'failed' && (tx.type === 'credit' ? '+' : '-')}
                                    ${tx.amount.toFixed(2)}
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
    );
};
