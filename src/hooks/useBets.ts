
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Bet {
  id: string;
  event_id?: string;
  creator_id: string;
  opponent_id?: string;
  amount: number;
  bet_type: string;
  bet_selection: string;
  odds: number;
  status: 'pending' | 'matched' | 'completed' | 'cancelled' | 'expired';
  vig_percent: number;
  expiry_time: string;
  outcome?: string;
  payout_amount?: number;
  created_at: string;
  updated_at: string;
}

interface GroupBet {
  id: string;
  event_id?: string;
  creator_id: string;
  title: string;
  description?: string;
  bet_type: string;
  target_outcome: string;
  total_pot: number;
  max_pot?: number;
  max_participants: number;
  vig_percent: number;
  status: string;
  result?: string;
  expiry_time: string;
  payout_distributed: boolean;
  created_at: string;
  updated_at: string;
}

export const useBets = () => {
  const { user } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [groupBets, setGroupBets] = useState<GroupBet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchBets();
    fetchGroupBets();
  }, [user]);

  const fetchBets = async () => {
    if (!user) return;

    try {
      // Using type assertion to work around type issues until Supabase types are updated
      const { data, error } = await (supabase as any)
        .from('bets')
        .select('*')
        .or(`creator_id.eq.${user.id},opponent_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBets(data || []);
    } catch (err) {
      console.error('Error fetching bets:', err);
      // Set mock data for development
      setBets([]);
    }
  };

  const fetchGroupBets = async () => {
    try {
      // Using type assertion to work around type issues until Supabase types are updated
      const { data, error } = await (supabase as any)
        .from('group_bets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroupBets(data || []);
    } catch (err) {
      console.error('Error fetching group bets:', err);
      // Set mock data for development
      setGroupBets([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    bets,
    groupBets,
    loading,
    refetchBets: fetchBets,
    refetchGroupBets: fetchGroupBets
  };
};
