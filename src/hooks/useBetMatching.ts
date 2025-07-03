
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BetMatch {
  id: string;
  creator_bet_id: string;
  opponent_bet_id: string;
  matched_amount: number;
  status: string;
  created_at: string;
}

interface BetEscrow {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export const useBetMatching = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<BetMatch[]>([]);
  const [escrows, setEscrows] = useState<BetEscrow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMatches();
      fetchEscrows();
    }
  }, [user]);

  const fetchMatches = async () => {
    try {
      // Using existing bets table to simulate bet matches
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .eq('status', 'matched')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform bets data to match structure
      const transformedMatches = data?.map(bet => ({
        id: bet.id,
        creator_bet_id: bet.id,
        opponent_bet_id: bet.opponent_id || '',
        matched_amount: bet.amount || 0,
        status: bet.status || 'active',
        created_at: bet.created_at || ''
      })) || [];
      
      setMatches(transformedMatches);
    } catch (error) {
      console.error('Error fetching bet matches:', error);
    }
  };

  const fetchEscrows = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('escrow_wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform escrow data to match expected structure
      const transformedEscrows = data?.map(escrow => ({
        id: escrow.id,
        user_id: escrow.user_id || '',
        amount: escrow.amount || 0,
        status: escrow.status || 'held',
        created_at: escrow.created_at || ''
      })) || [];
      
      setEscrows(transformedEscrows);
    } catch (error) {
      console.error('Error fetching escrows:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBetMatch = async (creatorBetId: string, opponentBetId: string, amount: number) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const platformFee = amount * 0.025;
      const escrowFee = amount > 5000 ? amount * 0.01 : 0;

      // Create escrow entry using existing table
      const { error: escrowError } = await supabase
        .from('escrow_wallets')
        .insert({
          user_id: user.id,
          bet_id: creatorBetId,
          amount: amount + platformFee + escrowFee,
          status: 'held'
        });

      if (escrowError) throw escrowError;

      await fetchMatches();
      await fetchEscrows();
      
      return { id: creatorBetId, matched_amount: amount };
    } catch (error) {
      console.error('Error creating bet match:', error);
      throw error;
    }
  };

  const releaseEscrow = async (escrowId: string) => {
    try {
      const { error } = await supabase
        .from('escrow_wallets')
        .update({ 
          status: 'released'
        })
        .eq('id', escrowId);

      if (error) throw error;
      await fetchEscrows();
    } catch (error) {
      console.error('Error releasing escrow:', error);
      throw error;
    }
  };

  return {
    matches,
    escrows,
    loading,
    createBetMatch,
    releaseEscrow,
    refetch: () => {
      fetchMatches();
      fetchEscrows();
    }
  };
};
