
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, CreditCard, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

export const WalletOnboarding: React.FC = () => {
  const { user } = useAuth();
  const { wallet, loading, error, refetch } = useWallet();
  const [fundAmount, setFundAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [localError, setLocalError] = useState('');
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

  const handleFundWallet = async () => {
    if (!user || !fundAmount || !wallet) return;
    
    const amount = parseFloat(fundAmount);
    if (amount <= 0 || amount > 10000) {
      setLocalError('Amount must be between $1 and $10,000');
      return;
    }

    setProcessing(true);
    setLocalError('');

    try {
      const newBalance = (wallet.balance || 0) + amount;
      
      const { error } = await supabase
        .from('user_wallets')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setFundAmount('');
      await refetch();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to fund wallet');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    return (amount || 0).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className={`ml-2 text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
              Loading wallet...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={isMobile ? 'text-sm' : ''}>
              Error loading wallet: {error}
              <Button onClick={handleRefresh} variant="outline" size="sm" className="ml-2">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card>
        <CardHeader className={`${isMobile ? 'p-4 pb-2' : ''}`}>
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : ''}`}>
            <Wallet className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            Wallet Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-4 pt-2' : ''}`}>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={isMobile ? 'text-sm' : ''}>
              Your wallet should exist with $500,000 balance. There might be a data sync issue.
            </AlertDescription>
          </Alert>
          
          <Button onClick={handleRefresh} disabled={refreshing} className="w-full">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Wallet Data'}
          </Button>
        </CardContent>
      </Card>
    );
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
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className={`text-green-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Available Balance</p>
            <p className={`font-bold text-green-700 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              ${formatCurrency(wallet.balance)}
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className={`text-orange-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>In Escrow</p>
            <p className={`font-bold text-orange-700 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              ${formatCurrency(wallet.escrow_held)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fund-amount" className={isMobile ? 'text-sm' : ''}>
            Add Funds (Demo)
          </Label>
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : ''}`}>
            <Input
              id="fund-amount"
              type="number"
              placeholder="Amount ($1 - $10,000)"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              min="1"
              max="10000"
              className={isMobile ? 'text-sm' : ''}
            />
            <Button 
              onClick={handleFundWallet}
              disabled={processing || !fundAmount}
              className={isMobile ? 'w-full' : ''}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {processing ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>

        {localError && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={isMobile ? 'text-sm' : ''}>{localError}</AlertDescription>
          </Alert>
        )}

        <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground space-y-1`}>
          <p>Daily Limit: ${formatCurrency(wallet.daily_limit)}</p>
          <p>Weekly Limit: ${formatCurrency(wallet.weekly_limit)}</p>
        </div>

        <div className={`mt-4 p-3 bg-blue-50 rounded-lg ${isMobile ? 'text-center' : ''}`}>
          <p className={`text-blue-600 ${isMobile ? 'text-xs' : 'text-xs'}`}>
            💰 Your wallet has been updated with $500,000 balance and $500,000 escrow. 
            {isMobile ? 'Tap refresh if needed.' : 'Click refresh if you don\'t see the latest amounts.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
