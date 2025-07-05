
export interface BookieTier {
  id: string;
  name: string;
  monthlyFee: number;
  dailyCap: number;
  features: string[];
  badge: string;
  description: string;
}

export const bookieTiers: BookieTier[] = [
  {
    id: 'local',
    name: 'Local Bookie',
    monthlyFee: 249,
    dailyCap: 5000,
    badge: '🏪',
    description: 'Perfect for neighborhood betting operations',
    features: [
      'Up to $5,000/day wagers',
      'Basic escrow management',
      'Standard odds feeds',
      'Community leaderboards',
      'Basic reporting dashboard'
    ]
  },
  {
    id: 'regional',
    name: 'Regional Host',
    monthlyFee: 499,
    dailyCap: 25000,
    badge: '🏢',
    description: 'Scale across multiple markets',
    features: [
      'Up to $25,000/day wagers',
      'Limited line controls',
      'Enhanced risk management',
      'Multi-market operations',
      'Advanced analytics',
      'Priority customer support'
    ]
  },
  {
    id: 'elite',
    name: 'Elite Operator',
    monthlyFee: 999,
    dailyCap: 100000,
    badge: '👑',
    description: 'Professional-grade betting operations',
    features: [
      'Up to $100,000/day wagers',
      'Full API feed access',
      'Escrow pool management',
      'Custom odds creation',
      'White-label branding',
      'Dedicated account manager'
    ]
  },
  {
    id: 'institutional',
    name: 'Institutional Desk',
    monthlyFee: 0, // Custom pricing
    dailyCap: -1, // Unlimited
    badge: '🏛️',
    description: 'Enterprise-level betting infrastructure',
    features: [
      'Unlimited volume',
      'External line access',
      'Collateralized onboarding',
      'Custom integrations',
      'Regulatory compliance tools',
      'Enterprise SLA'
    ]
  }
];
