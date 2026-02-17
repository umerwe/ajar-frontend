"use client";

import { useGetWallet } from '@/hooks/useWallet';
import { WalletPageComponent } from '@/components/pages/walletPage';
import Header from '@/components/ui/header';
import SkeletonLoader from '@/components/common/skeleton-loader';

const WalletPage = () => {
    const { data, isLoading } = useGetWallet();

    return (
        <div>
            <Header
                title='My Wallet'
            />
            {isLoading ? (
                <SkeletonLoader
                    variant="wallet"
                />
            ) : (
                <WalletPageComponent
                    isLoading={isLoading}
                    data={data}
                />
            )}
        </div>
    );
};

export default WalletPage;