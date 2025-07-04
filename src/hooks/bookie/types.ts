
import type { Database } from '@/integrations/supabase/types';

export type BookieOperator = Database['public']['Tables']['bookie_operators']['Row'];
export type BookieLine = Database['public']['Tables']['bookie_lines']['Row'];
export type BookieSyndicate = Database['public']['Tables']['bookie_syndicates']['Row'];
export type BookieTransaction = Database['public']['Tables']['bookie_transactions']['Row'];

export interface BookieState {
  operator: BookieOperator | null;
  lines: BookieLine[];
  syndicates: BookieSyndicate[];
  transactions: BookieTransaction[];
  loading: boolean;
  error: string | null;
}

export interface ApplyForLicenseData {
  businessName: string;
  tier: 'starter' | 'pro' | 'elite';
}

export interface CreateLineData {
  eventId: string;
  sportKey: string;
  matchName: string;
  marketType: string;
  selection: string;
  odds: number;
  stakeLimit: number;
  expiryTime: string;
  isPrivate?: boolean;
}

export interface CreateSyndicateData {
  title: string;
  description?: string;
  lineId: string;
  targetAmount: number;
  maxParticipants: number;
  minParticipants: number;
  closesAt: string;
  isPrivate?: boolean;
}
