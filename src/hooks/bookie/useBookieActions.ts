
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ApplyForLicenseData, CreateLineData, CreateSyndicateData, BookieOperator } from './types';

export const useBookieActions = () => {
  const applyForLicense = useCallback(async (
    userId: string, 
    applicationData: ApplyForLicenseData
  ) => {
    const tierPricing = {
      starter: 97,
      pro: 297,
      elite: 997
    };

    try {
      const { data, error } = await supabase
        .from('bookie_operators')
        .insert({
          user_id: userId,
          business_name: applicationData.businessName,
          tier: applicationData.tier,
          monthly_fee: tierPricing[applicationData.tier],
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error applying for license:', err);
      throw err;
    }
  }, []);

  const createLine = useCallback(async (operator: BookieOperator, lineData: CreateLineData) => {
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
      return data;
    } catch (err) {
      console.error('Error creating line:', err);
      throw err;
    }
  }, []);

  const createSyndicate = useCallback(async (operator: BookieOperator, syndicateData: CreateSyndicateData) => {
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
      return data;
    } catch (err) {
      console.error('Error creating syndicate:', err);
      throw err;
    }
  }, []);

  return {
    applyForLicense,
    createLine,
    createSyndicate,
  };
};
