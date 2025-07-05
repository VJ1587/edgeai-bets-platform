
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type UserWallet = Database['public']['Tables']['user_wallets']['Row'];

export const useWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const fetchWallet = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setWallet(null);
      setLoading(false);
      return;
    }

    // Prevent excessive API calls - only fetch if more than 5 seconds have passed
    const now = Date.now();
    if (!forceRefresh && (now - lastFetchTime) < 5000) {
      console.log('⏭️ Skipping wallet fetch - too recent');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLastFetchTime(now);
      
      console.log('🔄 Fetching wallet for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ Supabase error fetching wallet:', error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('✅ Wallet data found:', data[0]);
        setWallet(data[0]);
      } else {
        console.log('❌ No wallet found for user');
        setWallet(null);
      }
    } catch (err) {
      console.error('❌ Error in fetchWallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet');
      setWallet(null);
    } finally {
      setLoading(false);
    }
  }, [user, lastFetchTime]);

  useEffect(() => {
    if (!user) {
      setWallet(null);
      setLoading(false);
      return;
    }

    fetchWallet(true); // Force initial fetch
  }, [user, fetchWallet]);

  const updateBalance = async (newBalance: number) => {
    if (!user || !wallet) return;

    try {
      const { error } = await supabase
        .from('user_wallets')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setWallet(prev => prev ? { ...prev, balance: newBalance } : null);
    } catch (err) {
      console.error('Error updating balance:', err);
      throw err;
    }
  };

  const refetch = useCallback(() => fetchWallet(true), [fetchWallet]);

  return {
    wallet,
    loading,
    error,
    refetch,
    updateBalance
  };
};
