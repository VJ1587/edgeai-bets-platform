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

export interface BookieOperator {
  id: string;
  userId: string;
  tier: 'local' | 'regional' | 'elite' | 'institutional';
  businessName: string;
  monthlyFee: number;
  dailyCap: number;
  features: string[];
  status: 'pending' | 'active' | 'suspended';
  verificationLevel: 'basic' | 'kyc' | 'institutional';
}
