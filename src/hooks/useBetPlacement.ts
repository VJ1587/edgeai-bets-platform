
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';

interface BetPlacementParams {
  gameId: string;
  betType: string;
  selection: string;
  amount: number;
  odds: string;
  vigPercent?: number;
  expiryHours?: number;
  description?: string;
}

export const useBetPlacement = () => {
  const { user } = useAuth();
  const { wallet, refetch: refetchWallet } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const placeBet = async (params: BetPlacementParams) => {
    if (!user || !wallet) {
      toast({
        title: "Error",
        description: "Please sign in and set up your wallet first",
        variant: "destructive"
      });
      return null;
    }

    if (params.amount > (wallet.balance || 0)) {
      toast({
        title: "Insufficient Balance",
        description: `You need $${params.amount.toFixed(2)} but only have $${(wallet.balance || 0).toFixed(2)}`,
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);

    try {
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + (params.expiryHours || 24));

      // Calculate fees
      const platformFee = params.amount * 0.025; // 2.5%
      const escrowFee = params.amount > 5000 ? params.amount * 0.01 : 0; // 1% for large bets
      const totalDeduction = params.amount + platformFee + escrowFee;

      // Create the bet
      const { data: betData, error: betError } = await supabase
        .from('bets')
        .insert({
          creator_id: user.id,
          bet_type: params.betType,
          bet_selection: params.selection,
          amount: params.amount,
          odds: params.odds,
          event_id: params.gameId,
          vig_percent: params.vigPercent || 10,
          expiry_time: expiryTime.toISOString(),
          status: 'open'
        })
        .select()
        .single();

      if (betError) throw betError;

      // Update wallet balance (deduct bet amount + fees)
      const { error: walletError } = await supabase
        .from('user_wallets')
        .update({ 
          balance: (wallet.balance || 0) - totalDeduction,
          escrow_held: (wallet.escrow_held || 0) + params.amount
        })
        .eq('user_id', user.id);

      if (walletError) throw walletError;

      // Create escrow record
      const { error: escrowError } = await supabase
        .from('escrow_wallets')
        .insert({
          user_id: user.id,
          bet_id: betData.id,
          amount: params.amount,
          status: 'held'
        });

      if (escrowError) throw escrowError;

      await refetchWallet();

      toast({
        title: "Bet Placed Successfully!",
        description: `Your $${params.amount.toFixed(2)} bet has been placed and is waiting for an opponent.`,
      });

      return betData;
    } catch (error) {
      console.error('Error placing bet:', error);
      toast({
        title: "Error Placing Bet",
        description: error instanceof Error ? error.message : "Failed to place bet",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    placeBet,
    loading
  };
};
