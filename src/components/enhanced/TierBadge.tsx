
import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { UserTier } from '@/types/edgestake';

interface TierBadgeProps {
  tier: UserTier['level'];
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const tierConfig = {
  Contender: { badge: '🥊', color: 'bg-gray-500', label: 'Contender' },
  Challenger: { badge: '⚡', color: 'bg-blue-500', label: 'Challenger' },
  Elite: { badge: '💎', color: 'bg-purple-500', label: 'Elite' },
  KingMaker: { badge: '👑', color: 'bg-yellow-500', label: 'KingMaker' }
};

export const TierBadge: React.FC<TierBadgeProps> = ({ 
  tier, 
  showLabel = true, 
  size = 'md' 
}) => {
  const config = tierConfig[tier];
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      className={`${config.color} text-white ${sizeClasses[size]} font-semibold`}
    >
      <span className="mr-1">{config.badge}</span>
      {showLabel && config.label}
    </Badge>
  );
};
