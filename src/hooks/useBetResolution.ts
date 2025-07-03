
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ResolveBetParams {
  betId: string;
  winnerId: string;
  outcome: 'win' | 'loss' | 'push';
  adminNotes?: string;
}

export const useBetResolution = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const resolveBet = async (params: ResolveBetParams) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to resolve bets",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);

    try {
      // Get bet details
      const { data: bet, error: betError } = await supabase
        .from('bets')
        .select('*')
        .eq('id', params.betId)
        .single();

      if (betError) throw betError;

      if (!bet) {
        throw new Error('Bet not found');
      }

      // Update bet status
      const { error: updateError } = await supabase
        .from('bets')
        .update({
          status: 'completed',
          outcome: params.outcome,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.betId);

      if (updateError) throw updateError;

      // Calculate payouts
      const betAmount = bet.amount || 0;
      const platformFee = betAmount * 0.025;
      const escrowFee = betAmount > 5000 ? betAmount * 0.01 : 0;

      if (params.outcome === 'win') {
        // Winner gets their bet back + winnings - fees
        const oddsValue = parseFloat(bet.odds || '100');
        const winnings = oddsValue > 0 ? betAmount * (oddsValue / 100) : betAmount * (100 / Math.abs(oddsValue));
        const totalPayout = betAmount + winnings - platformFee - escrowFee;

        // Update winner's wallet
        const { data: winnerWallet } = await supabase
          .from('user_wallets')
          .select('*')
          .eq('user_id', params.winnerId)
          .single();

        if (winnerWallet) {
          await supabase
            .from('user_wallets')
            .update({
              balance: (winnerWallet.balance || 0) + totalPayout,
              escrow_held: Math.max(0, (winnerWallet.escrow_held || 0) - betAmount)
            })
            .eq('user_id', params.winnerId);
        }
      } else if (params.outcome === 'push') {
        // Return original bet amount to both parties
        const refundAmount = betAmount - platformFee; // Small platform fee still applies

        // Refund creator
        const { data: creatorWallet } = await supabase
          .from('user_wallets')
          .select('*')
          .eq('user_id', bet.creator_id)
          .single();

        if (creatorWallet) {
          await supabase
            .from('user_wallets')
            .update({
              balance: (creatorWallet.balance || 0) + refundAmount,
              escrow_held: Math.max(0, (creatorWallet.escrow_held || 0) - betAmount)
            })
            .eq('user_id', bet.creator_id);
        }

        // Refund opponent if exists
        if (bet.opponent_id) {
          const { data: opponentWallet } = await supabase
            .from('user_wallets')
            .select('*')
            .eq('user_id', bet.opponent_id)
            .single();

          if (opponentWallet) {
            await supabase
              .from('user_wallets')
              .update({
                balance: (opponentWallet.balance || 0) + refundAmount,
                escrow_held: Math.max(0, (opponentWallet.escrow_held || 0) - betAmount)
              })
              .eq('user_id', bet.opponent_id);
          }
        }
      }

      // Update escrow status
      await supabase
        .from('escrow_wallets')
        .update({ status: 'released' })
        .eq('bet_id', params.betId);

      toast({
        title: "Bet Resolved",
        description: `Bet has been resolved with outcome: ${params.outcome}`,
      });

      return true;
    } catch (error) {
      console.error('Error resolving bet:', error);
      toast({
        title: "Error Resolving Bet",
        description: error instanceof Error ? error.message : "Failed to resolve bet",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateMockResults = async () => {
    setLoading(true);
    
    try {
      // Get open bets
      const { data: openBets, error } = await supabase
        .from('bets')
        .select('*')
        .eq('status', 'open')
        .limit(5);

      if (error) throw error;

      if (!openBets || openBets.length === 0) {
        toast({
          title: "No Open Bets",
          description: "No open bets found to generate results for",
        });
        return;
      }

      // Resolve each bet with random outcomes
      for (const bet of openBets) {
        const outcomes = ['win', 'loss', 'push'] as const;
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        const winnerId = randomOutcome === 'win' ? bet.creator_id : bet.opponent_id || bet.creator_id;

        await resolveBet({
          betId: bet.id,
          winnerId: winnerId || bet.creator_id,
          outcome: randomOutcome,
          adminNotes: 'Auto-generated result for demo'
        });
      }

      toast({
        title: "Results Generated",
        description: `Generated results for ${openBets.length} bets`,
      });
    } catch (error) {
      console.error('Error generating results:', error);
      toast({
        title: "Error",
        description: "Failed to generate mock results",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    resolveBet,
    generateMockResults,
    loading
  };
};
