
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReferralStats {
  total_invites: number;
  completed_challenges: number;
  conversion_rate: number;
  total_bonus_earned: number;
  badges: string[];
}

interface TopReferrer {
  user_id: string;
  username: string;
  total_referrals: number;
  conversion_rate: number;
}

export const useReferralTracking = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferralStats();
      fetchTopReferrers();
    }
  }, [user]);

  const fetchReferralStats = async () => {
    if (!user) return;

    try {
      // Get user's referral activity from the new table
      const { data: referrals, error } = await supabase
        .from('referral_activity')
        .select('*')
        .eq('source_user_id', user.id);

      if (error) throw error;

      const totalInvites = referrals?.length || 0;
      const completedChallenges = referrals?.filter(r => r.status === 'completed').length || 0;
      const conversionRate = totalInvites > 0 ? (completedChallenges / totalInvites) * 100 : 0;
      const totalBonusEarned = referrals?.reduce((sum, r) => sum + (r.bonus_amount || 0), 0) || 0;

      // Calculate badges
      const badges = [];
      if (completedChallenges >= 3) badges.push('Battle Recruiter');
      if (completedChallenges >= 5) badges.push('Syndicate Commander');
      if (completedChallenges >= 3) badges.push('Bookie Magnet'); // Simplified for demo

      setStats({
        total_invites: totalInvites,
        completed_challenges: completedChallenges,
        conversion_rate: conversionRate,
        total_bonus_earned: totalBonusEarned,
        badges
      });
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopReferrers = async () => {
    try {
      // Get completed referrals grouped by user
      const { data: referrals, error } = await supabase
        .from('referral_activity')
        .select('source_user_id')
        .eq('status', 'completed');

      if (error) throw error;

      // Get profile information separately
      const userIds = [...new Set(referrals?.map(r => r.source_user_id) || [])];
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profileError) throw profileError;

      // Group by user and calculate stats
      const userStats = new Map();
      referrals?.forEach(item => {
        const userId = item.source_user_id;
        if (!userStats.has(userId)) {
          const profile = profiles?.find(p => p.id === userId);
          userStats.set(userId, {
            user_id: userId,
            username: profile?.full_name || 'Anonymous',
            total_referrals: 0
          });
        }
        userStats.get(userId).total_referrals++;
      });

      const topUsers = Array.from(userStats.values())
        .sort((a, b) => b.total_referrals - a.total_referrals)
        .slice(0, 10)
        .map(user => ({
          ...user,
          conversion_rate: 100 // Simplified for demo
        }));

      setTopReferrers(topUsers);
    } catch (error) {
      console.error('Error fetching top referrers:', error);
    }
  };

  return {
    stats,
    topReferrers,
    loading,
    refetch: () => {
      fetchReferralStats();
      fetchTopReferrers();
    }
  };
};
