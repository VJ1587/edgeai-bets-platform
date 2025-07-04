
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type BookieOperator = Database['public']['Tables']['bookie_operators']['Row'];
type BookieLine = Database['public']['Tables']['bookie_lines']['Row'];
type BookieSyndicate = Database['public']['Tables']['bookie_syndicates']['Row'];
type BookieTransaction = Database['public']['Tables']['bookie_transactions']['Row'];

export const useBookieOperator = () => {
  const { user } = useAuth();
  const [operator, setOperator] = useState<BookieOperator | null>(null);
  const [lines, setLines] = useState<BookieLine[]>([]);
  const [syndicates, setSyndicates] = useState<BookieSyndicate[]>([]);
  const [transactions, setTransactions] = useState<BookieTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchBookieData();
  }, [user]);

  const fetchBookieData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch bookie operator profile
      const { data: operatorData, error: operatorError } = await supabase
        .from('bookie_operators')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (operatorError) throw operatorError;
      setOperator(operatorData);

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
      setError(err instanceof Error ? err.message : 'Failed to fetch bookie data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLines = async (bookieId: string) => {
    const { data, error } = await supabase
      .from('bookie_lines')
      .select('*')
      .eq('bookie_id', bookieId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setLines(data || []);
  };

  const fetchSyndicates = async (bookieId: string) => {
    const { data, error } = await supabase
      .from('bookie_syndicates')
      .select('*')
      .eq('bookie_id', bookieId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setSyndicates(data || []);
  };

  const fetchTransactions = async (bookieId: string) => {
    const { data, error } = await supabase
      .from('bookie_transactions')
      .select('*')
      .eq('bookie_id', bookieId)
      .order('processed_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    setTransactions(data || []);
  };

  const applyForLicense = async (applicationData: {
    businessName: string;
    tier: 'starter' | 'pro' | 'elite';
  }) => {
    if (!user) throw new Error('User not authenticated');

    const tierPricing = {
      starter: 97,
      pro: 297,
      elite: 997
    };

    try {
      const { data, error } = await supabase
        .from('bookie_operators')
        .insert({
          user_id: user.id,
          business_name: applicationData.businessName,
          tier: applicationData.tier,
          monthly_fee: tierPricing[applicationData.tier],
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      setOperator(data);
      return data;
    } catch (err) {
      console.error('Error applying for license:', err);
      throw err;
    }
  };

  const createLine = async (lineData: {
    eventId: string;
    sportKey: string;
    matchName: string;
    marketType: string;
    selection: string;
    odds: number;
    stakeLimit: number;
    expiryTime: string;
    isPrivate?: boolean;
  }) => {
    if (!operator) throw new Error('No bookie operator found');

    try {
      const { data, error } = await supabase
        .from('bookie_lines')
        .insert({
          bookie_id: operator.id,
          event_id: lineData.eventId,
          sport_key: lineData.sportKey,
          match_name: lineData.matchName,
          market_type: lineData.marketType,
          selection: lineData.selection,
          odds: lineData.odds,
          stake_limit: lineData.stakeLimit,
          expiry_time: lineData.expiryTime,
          is_private: lineData.isPrivate || false
        })
        .select()
        .single();

      if (error) throw error;
      await fetchLines(operator.id);
      return data;
    } catch (err) {
      console.error('Error creating line:', err);
      throw err;
    }
  };

  const createSyndicate = async (syndicateData: {
    title: string;
    description?: string;
    lineId: string;
    targetAmount: number;
    maxParticipants: number;
    minParticipants: number;
    closesAt: string;
    isPrivate?: boolean;
  }) => {
    if (!operator) throw new Error('No bookie operator found');

    try {
      const { data, error } = await supabase
        .from('bookie_syndicates')
        .insert({
          bookie_id: operator.id,
          title: syndicateData.title,
          description: syndicateData.description,
          line_id: syndicateData.lineId,
          target_amount: syndicateData.targetAmount,
          max_participants: syndicateData.maxParticipants,
          min_participants: syndicateData.minParticipants,
          closes_at: syndicateData.closesAt,
          is_private: syndicateData.isPrivate || false
        })
        .select()
        .single();

      if (error) throw error;
      await fetchSyndicates(operator.id);
      return data;
    } catch (err) {
      console.error('Error creating syndicate:', err);
      throw err;
    }
  };

  return {
    operator,
    lines,
    syndicates,
    transactions,
    loading,
    error,
    isBookieOperator: !!operator && operator.status === 'active',
    applyForLicense,
    createLine,
    createSyndicate,
    refetch: fetchBookieData
  };
};
