
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WalletLimitsProps {
  dailyLimit: number | null | undefined;
  weeklyLimit: number | null | undefined;
}

export const WalletLimits: React.FC<WalletLimitsProps> = ({ dailyLimit, weeklyLimit }) => {
  const isMobile = useIsMobile();

  const formatCurrency = (amount: number | null | undefined) => {
    return (amount || 0).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground space-y-1`}>
      <p>Daily Limit: ${formatCurrency(dailyLimit)}</p>
      <p>Weekly Limit: ${formatCurrency(weeklyLimit)}</p>
    </div>
  );
};
