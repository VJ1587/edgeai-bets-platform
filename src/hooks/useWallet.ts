
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
      setError(null);
      
      // Use maybeSingle() instead of single() to handle cases where no wallet exists
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data) {
        console.log('Wallet data fetched:', data);
        setWallet(data);
      } else {
        console.log('No wallet found for user, creating default wallet...');
        // If no wallet exists, create one
        const { data: newWallet, error: createError } = await supabase
          .from('user_wallets')
          .insert({
            user_id: user.id,
            balance: 0.00,
            escrow_held: 0.00,
            daily_limit: 1000.00,
            weekly_limit: 5000.00
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating wallet:', createError);
          throw createError;
        }

        setWallet(newWallet);
      }
    } catch (err) {
      console.error('Error in fetchWallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet');
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
