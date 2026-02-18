"use client";

import { useState } from 'react';
import { PlusCircle, ArrowUpCircle } from 'lucide-react';
import { Transaction } from '@/types/wallet';
import { PaymentDialog } from '@/components/dialogs/payment';
import { TopUpDialog } from '@/components/dialogs/topUp';
import { WithdrawDialog } from '@/components/dialogs/withdraw';
import { WalletBalance } from '@/components/pages/wallet/walletBalance';
import { WalletTransactions } from '@/components/pages/wallet/walletTransactions';

interface WalletPageProps {
    isLoading?: boolean;
    data?: {
        balance: number;
        transactions: Transaction[];
    };
}

export const WalletPageComponent: React.FC<WalletPageProps> = ({ 
    isLoading = false, 
    data = { balance: 0, transactions: [] } 
}) => {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [submittedAmount, setSubmittedAmount] = useState<number | null>(null);
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    const balance = data?.balance || 0;
    const transactions = data?.transactions || [];

    const handlePaymentSuccess = (secret: string, amount: number) => {
        setClientSecret(secret);
        setSubmittedAmount(amount);
        setIsPaymentOpen(true);
    };

    const handleWithdrawSuccess = () => {
        // window.location.reload();
    };

    if (isLoading) {
        return null;
    }

    return (
        <div className="bg-white max-w-md mx-auto font-sans text-slate-900 border rounded-md py-8 my-6 md:my-10">
            {/* Balance Section */}
            <WalletBalance balance={balance} />

            {/* Action Buttons */}
            <section className="flex justify-around mt-10 px-6">
                <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setIsTopUpOpen(true)}>
                    <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-[#00D1A0]/10 transition-colors">
                        <PlusCircle className="w-7 h-7 text-[#00D1A0]" />
                    </div>
                    <span className="text-sm font-semibold">Top Up</span>
                </div>

                <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setIsWithdrawOpen(true)}>
                    <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-[#00D1A0]/10 transition-colors">
                        <ArrowUpCircle className="w-7 h-7 text-[#00D1A0]" />
                    </div>
                    <span className="text-sm font-semibold">Withdraw</span>
                </div>
            </section>

            {/* Latest Transactions */}
            <WalletTransactions transactions={transactions} />

            {/* Dialogs */}
            <TopUpDialog
                open={isTopUpOpen}
                onOpenChange={setIsTopUpOpen}
                onPaymentSuccess={handlePaymentSuccess}
            />

            <WithdrawDialog
                open={isWithdrawOpen}
                onOpenChange={setIsWithdrawOpen}
                onWithdrawSuccess={handleWithdrawSuccess}
            />

            <PaymentDialog
                open={isPaymentOpen}
                onOpenChange={setIsPaymentOpen}
                clientSecret={clientSecret}
                amount={submittedAmount as number}
            />
        </div>
    );
};
