
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { BookieOperator, BookieLine, BookieSyndicate, BookieTransaction, BookieState } from './types';

export const useBookieData = () => {
  const [state, setState] = useState<BookieState>({
    operator: null,
    lines: [],
    syndicates: [],
    transactions: [],
    loading: true,
    error: null,
  });

  const fetchBookieData = useCallback(async (userId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Fetch bookie operator profile
      const { data: operatorData, error: operatorError } = await supabase
        .from('bookie_operators')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (operatorError) throw operatorError;
      
      setState(prev => ({ ...prev, operator: operatorData }));

      // If user is a bookie operator, fetch additional data
      if (operatorData) {
        await Promise.all([
          fetchLines(operatorData.id),
          fetchSyndicates(operatorData.id),
          fetchTransactions(operatorData.id)
        ]);
      }
    } catch (err) {
      console.error('Error fetching bookie data:', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Failed to fetch bookie data' 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const fetchLines = async (bookieId: string) => {
    const { data, error } = await supabase
      .from('bookie_lines')
      .select('*')
      .eq('bookie_id', bookieId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setState(prev => ({ ...prev, lines: data || [] }));
  };

  const fetchSyndicates = async (bookieId: string) => {
    const { data, error } = await supabase
      .from('bookie_syndicates')
      .select('*')
      .eq('bookie_id', bookieId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setState(prev => ({ ...prev, syndicates: data || [] }));
  };

  const fetchTransactions = async (bookieId: string) => {
    const { data, error } = await supabase
      .from('bookie_transactions')
      .select('*')
      .eq('bookie_id', bookieId)
      .order('processed_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    setState(prev => ({ ...prev, transactions: data || [] }));
  };

  return {
    state,
    fetchBookieData,
    refetchLines: (bookieId: string) => fetchLines(bookieId),
    refetchSyndicates: (bookieId: string) => fetchSyndicates(bookieId),
  };
};
