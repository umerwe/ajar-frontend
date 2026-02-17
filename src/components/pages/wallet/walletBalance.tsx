"use client";

import { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';

interface WalletBalanceProps {
    balance: number;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ balance }) => {
    const [showBalance, setShowBalance] = useState(true);

    return (
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
    );
};
