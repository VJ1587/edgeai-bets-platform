
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type UserWallet = Database['public']['Tables']['user_wallets']['Row'];

export const useWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setWallet(null);
      setLoading(false);
      return;
    }

    fetchWallet();
  }, [user]);

  const fetchWallet = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching wallet for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Supabase error fetching wallet:', error);
        throw error;
      }

      if (data) {
        console.log('Wallet data found:', data);
        setWallet(data);
      } else {
        console.log('No wallet found, wallet should exist with updated balances');
        // Don't create a new wallet here, just set to null so component shows the issue
        setWallet(null);
      }
    } catch (err) {
      console.error('Error in fetchWallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet');
      setWallet(null);
    } finally {
      setLoading(false);
    }
  };

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

  return {
    wallet,
    loading,
    error,
    refetch: fetchWallet,
    updateBalance
  };
};
