
import type { ChallengeType } from '@/types/edgestake';

export const challengeTypes: ChallengeType[] = [
  {
    id: 'kings-duel',
    name: "King's Duel",
    icon: '⚔️',
    description: '1v1 high-stakes skill showdown',
    minStake: 10,
    maxStake: 10000,
    category: 'duel'
  },
  {
    id: 'the-arena',
    name: 'The Arena',
    icon: '🏛️',
    description: 'Multi-user syndicate betting hub',
    minStake: 5,
    maxStake: 50000,
    category: 'arena'
  },
  {
    id: 'syndistack',
    name: 'SyndiStack',
    icon: '💎',
    description: 'Pooled wagers with risk splitting',
    minStake: 1,
    maxStake: 25000,
    category: 'syndicate'
  },
  {
    id: 'the-pit',
    name: 'The Pit',
    icon: '🔥',
    description: 'Open odds market for unmatched challenges',
    minStake: 1,
    maxStake: 100000,
    category: 'pit'
  },
  {
    id: 'kingmaker',
    name: 'Kingmaker',
    icon: '👑',
    description: 'Elite wallet-verified head-to-head system',
    minStake: 1000,
    maxStake: 100000,
    category: 'kingmaker'
  }
];
