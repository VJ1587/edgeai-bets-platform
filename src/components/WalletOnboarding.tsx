
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

export const WalletOnboarding: React.FC = () => {
  const { user } = useAuth();
  const { wallet, loading, refetch } = useWallet();
  const [fundAmount, setFundAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Auto-refresh wallet data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !loading) {
        refetch();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, loading, refetch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreateWallet = async () => {
    if (!user) return;
    
    setProcessing(true);
    setError('');

    try {
      const { error } = await supabase
        .from('user_wallets')
        .upsert({
          user_id: user.id,
          balance: 0.00,
          escrow_held: 0.00,
          daily_limit: 10000.00,
          weekly_limit: 50000.00
        });

      if (error) throw error;
      await refetch(); // Refresh after creation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
    } finally {
      setProcessing(false);
    }
  };

  const handleFundWallet = async () => {
    if (!user || !fundAmount) return;
    
    const amount = parseFloat(fundAmount);
    if (amount <= 0 || amount > 10000) {
      setError('Amount must be between $1 and $10,000');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real app, this would integrate with Stripe/payment processor
      const newBalance = (wallet?.balance || 0) + amount;
      
      const { error } = await supabase
        .from('user_wallets')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setFundAmount('');
      await refetch(); // Refresh after funding
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fund wallet');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Create Your Betting Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Set up your secure betting wallet to start placing bets and joining syndicates.
          </p>
          
          {error && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleCreateWallet} 
            disabled={processing}
            className="w-full"
          >
            {processing ? 'Creating...' : 'Create Wallet'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
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
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-600">Available Balance</p>
            <p className="text-2xl font-bold text-green-700">
              ${wallet.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-600">In Escrow</p>
            <p className="text-2xl font-bold text-orange-700">
              ${wallet.escrow_held?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fund-amount">Add Funds (Demo)</Label>
          <div className="flex gap-2">
            <Input
              id="fund-amount"
              type="number"
              placeholder="Amount ($1 - $10,000)"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              min="1"
              max="10000"
            />
            <Button 
              onClick={handleFundWallet}
              disabled={processing || !fundAmount}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {processing ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>

        {error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground">
          <p>Daily Limit: ${wallet.daily_limit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
          <p>Weekly Limit: ${wallet.weekly_limit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600">
            💡 Your wallet has been updated with $500,000 balance and $500,000 escrow. 
            Click refresh if you don't see the latest amounts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
