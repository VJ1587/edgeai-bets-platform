
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type GroupChallenge = Database['public']['Tables']['group_challenges']['Row'];
type GroupBetContribution = Database['public']['Tables']['group_bet_contributions']['Row'];

export const useGroupChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<GroupChallenge[]>([]);
  const [myContributions, setMyContributions] = useState<GroupBetContribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
    if (user) {
      fetchMyContributions();
    }
  }, [user]);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('group_challenges')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (err) {
      console.error('Error fetching group challenges:', err);
      setChallenges([]);
    }
  };

  const fetchMyContributions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('group_bet_contributions')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setMyContributions(data || []);
    } catch (err) {
      console.error('Error fetching contributions:', err);
      setMyContributions([]);
    } finally {
      setLoading(false);
    }
  };

  const createChallenge = async (challengeData: {
    title: string;
    description?: string;
    eventId: string;
    betType: string;
    targetAmount: number;
    entryFee: number;
    maxParticipants?: number;
    minParticipants?: number;
    vigPercent?: number;
    expiryTime: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('group_challenges')
        .insert({
          creator_id: user.id,
          title: challengeData.title,
          description: challengeData.description,
          event_id: challengeData.eventId,
          bet_type: challengeData.betType,
          target_amount: challengeData.targetAmount,
          entry_fee: challengeData.entryFee,
          max_participants: challengeData.maxParticipants || 10,
          min_participants: challengeData.minParticipants || 2,
          vig_percent: challengeData.vigPercent || 10.00,
          expiry_time: challengeData.expiryTime
        })
        .select()
        .single();

      if (error) throw error;
      await fetchChallenges();
      return data;
    } catch (err) {
      console.error('Error creating challenge:', err);
      throw err;
    }
  };

  const joinChallenge = async (challengeId: string, amount: number) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('group_bet_contributions')
        .insert({
          group_bet_id: challengeId,
          user_id: user.id,
          amount: amount
        });

      if (error) throw error;
      await fetchChallenges();
      await fetchMyContributions();
    } catch (err) {
      console.error('Error joining challenge:', err);
      throw err;
    }
  };

  return {
    challenges,
    myContributions,
    loading,
    createChallenge,
    joinChallenge,
    refetch: () => {
      fetchChallenges();
      if (user) fetchMyContributions();
    }
  };
};
