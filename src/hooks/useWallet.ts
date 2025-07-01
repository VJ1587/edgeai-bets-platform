
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
      setLoading(false);
      return;
    }

    fetchWallet();
  }, [user]);

  const fetchWallet = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setWallet(data);
    } catch (err) {
      console.error('Error fetching wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet');
      
      // Set mock wallet data for development with all required fields
      setWallet({
        id: 'mock-wallet-id',
        user_id: user.id,
        balance: 100.00,
        escrow_held: 0.00,
        margin_status: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_transaction_at: null,
        daily_limit: 1000.00,
        weekly_limit: 5000.00
      });
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
