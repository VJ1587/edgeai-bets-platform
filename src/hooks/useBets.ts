
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type Bet = Database['public']['Tables']['bets']['Row'];
type GroupBet = Database['public']['Tables']['group_bets']['Row'];

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
      const { data, error } = await supabase
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
      const { data, error } = await supabase
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
