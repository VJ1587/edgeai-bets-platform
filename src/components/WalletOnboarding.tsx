
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { useIsMobile } from '@/hooks/use-mobile';
import { WalletBalance } from './wallet/WalletBalance';
import { FundWalletForm } from './wallet/FundWalletForm';
import { WalletLimits } from './wallet/WalletLimits';
import { WalletStatus } from './wallet/WalletStatus';
import { WalletLoadingState } from './wallet/WalletLoadingState';
import { WalletErrorState } from './wallet/WalletErrorState';
import { WalletNotFoundState } from './wallet/WalletNotFoundState';

export const WalletOnboarding: React.FC = () => {
  const { user } = useAuth();
  const { wallet, loading, error, refetch } = useWallet();
  const [refreshing, setRefreshing] = useState(false);
  const isMobile = useIsMobile();

  // Auto-refresh wallet data every 15 seconds (reduced from 10)
  useEffect(() => {
    if (!user || loading || refreshing) return;

    const interval = setInterval(() => {
      console.log('⏰ Auto-refresh wallet data');
      refetch();
    }, 15000);

    return () => clearInterval(interval);
  }, [user, loading, refetch, refreshing]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading) {
    return <WalletLoadingState />;
  }

  if (error) {
    return <WalletErrorState error={error} onRetry={handleRefresh} />;
  }

  if (!wallet) {
    return <WalletNotFoundState onRefresh={handleRefresh} refreshing={refreshing} />;
  }

  return (
    <Card>
      <CardHeader className={`${isMobile ? 'p-4 pb-2' : ''}`}>
        <CardTitle className={`flex items-center justify-between ${isMobile ? 'text-lg' : ''}`}>
          <div className="flex items-center gap-2">
            <Wallet className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            Wallet Management
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-4 ${isMobile ? 'p-4 pt-2' : ''}`}>
        <WalletBalance balance={wallet.balance} escrowHeld={wallet.escrow_held} />
        <FundWalletForm wallet={wallet} onFundingComplete={refetch} />
        <WalletLimits dailyLimit={wallet.daily_limit} weeklyLimit={wallet.weekly_limit} />
        <WalletStatus />
      </CardContent>
    </Card>
  );
};
