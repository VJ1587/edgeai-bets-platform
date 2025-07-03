
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type BetMatch = Database['public']['Tables']['bet_matches']['Row'];
type BetEscrow = Database['public']['Tables']['bet_escrow']['Row'];

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
      const { data, error } = await supabase
        .from('bet_matches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching bet matches:', error);
    }
  };

  const fetchEscrows = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bet_escrow')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEscrows(data || []);
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
      const totalEscrow = amount + platformFee + escrowFee;

      const { data, error } = await supabase
        .from('bet_matches')
        .insert({
          creator_bet_id: creatorBetId,
          opponent_bet_id: opponentBetId,
          matched_amount: amount,
          platform_fee: platformFee,
          escrow_fee: escrowFee,
          total_escrow: totalEscrow
        })
        .select()
        .single();

      if (error) throw error;

      // Create escrow entries for both parties
      const escrowEntries = [
        {
          bet_match_id: data.id,
          user_id: user.id,
          amount: amount,
          platform_fee: platformFee / 2,
          escrow_fee: escrowFee / 2
        }
      ];

      const { error: escrowError } = await supabase
        .from('bet_escrow')
        .insert(escrowEntries);

      if (escrowError) throw escrowError;

      await fetchMatches();
      await fetchEscrows();
      return data;
    } catch (error) {
      console.error('Error creating bet match:', error);
      throw error;
    }
  };

  const releasEscrow = async (escrowId: string) => {
    try {
      const { error } = await supabase
        .from('bet_escrow')
        .update({ 
          status: 'released',
          released_at: new Date().toISOString()
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
    releasEscrow,
    refetch: () => {
      fetchMatches();
      fetchEscrows();
    }
  };
};
