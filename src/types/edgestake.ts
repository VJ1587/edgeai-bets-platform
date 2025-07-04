
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
