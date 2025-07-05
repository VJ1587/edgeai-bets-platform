
export interface BetTier {
  id: string;
  name: string;
  monthlyFee: number;
  dailyCap: number;
  features: string[];
  badge: string;
}

export interface DemoEvent {
  id: string;
  title: string;
  category: 'sports' | 'esports' | 'gaming';
  date: string;
  odds: Record<string, number>;
  description: string;
  featured?: boolean;
}

export interface ChallengeType {
  id: string;
  name: string;
  icon: string;
  description: string;
  minStake: number;
  maxStake: number;
  category: 'duel' | 'arena' | 'syndicate' | 'pit' | 'kingmaker';
}

export interface UserTier {
  level: 'Contender' | 'Challenger' | 'Elite' | 'KingMaker';
  badge: string;
  privileges: string[];
}

export interface EscrowTransaction {
  id: string;
  amount: number;
  status: 'pending' | 'locked' | 'released' | 'disputed';
  platformFee: number;
  escrowFee: number;
  createdAt: string;
}

export interface BetSimulationFlow {
  type: 'throne_duel' | 'arena_syndicate' | 'kingmaker' | 'gamer_match' | 'pit_challenge';
  steps: BetFlowStep[];
  fees: FeeStructure;
}

export interface BetFlowStep {
  id: string;
  name: string;
  description: string;
  automated: boolean;
  duration?: string;
}

export interface FeeStructure {
  platformFee: number; // 2.5%
  escrowFee?: number; // 1% for stakes >$5K
  syndicateFee?: number; // 0.5% to 2% based on volume
  maxDailyPayout: number; // $100K default
}

export interface GamerConnection {
  platform: 'xbox' | 'psn' | 'steam' | 'discord' | 'epic';
  username: string;
  verified: boolean;
  connectedAt: string;
}

export interface ShareableLink {
  id: string;
  betType: 'duel' | 'syndicate' | 'gamer_match' | 'custom_market';
  shortUrl: string;
  expiresAt: string;
  metadata: {
    title: string;
    amount: number;
    sport?: string;
    odds?: Record<string, number>;
  };
}

// Updated BookieOperator to match database schema
export interface BookieOperator {
  id: string;
  user_id: string; // matches database column name
  tier: 'starter' | 'pro' | 'elite';
  business_name: string; // matches database column name
  monthly_fee: number; // matches database column name
  status: 'pending' | 'active' | 'suspended' | 'terminated';
  kyc_verified: boolean;
  kyc_verified_at: string | null;
  liquidity_validated: boolean;
  liquidity_validated_at: string | null;
  bank_account_verified: boolean;
  crypto_escrow_verified: boolean;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  approved_by: string | null;
  license_number: string | null;
}
