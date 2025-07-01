
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type MatchOdds = Database['public']['Tables']['match_odds']['Row'];

export const useMatchOdds = (sportKey?: string, limit: number = 20) => {
  const [odds, setOdds] = useState<MatchOdds[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOdds();
  }, [sportKey, limit]);

  const fetchOdds = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('match_odds')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(limit);

      if (sportKey) {
        query = query.eq('sport_key', sportKey);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setOdds(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching match odds:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch odds');
      
      // Set mock data for development
      setOdds([
        {
          id: 'mock-odds-1',
          event_id: 'mock-event-1',
          sport_key: 'americanfootball_nfl',
          match_name: 'Kansas City Chiefs vs Buffalo Bills',
          home_team: 'Kansas City Chiefs',
          away_team: 'Buffalo Bills',
          commence_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          bookmaker: 'draftkings',
          market: 'h2h',
          odds_data: {
            home: 1.85,
            away: 1.95
          },
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getOddsByEvent = (eventId: string) => {
    return odds.filter(odd => odd.event_id === eventId);
  };

  const getOddsBySport = (sport: string) => {
    return odds.filter(odd => odd.sport_key === sport);
  };

  return {
    odds,
    loading,
    error,
    refetch: fetchOdds,
    getOddsByEvent,
    getOddsBySport
  };
};
