
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WalletBalanceProps {
  balance: number | null | undefined;
  escrowHeld: number | null | undefined;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ balance, escrowHeld }) => {
  const isMobile = useIsMobile();

  const formatCurrency = (amount: number | null | undefined) => {
    return (amount || 0).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
      <div className="bg-green-50 p-3 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
        <p className={`text-green-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Available Balance</p>
        <p className={`font-bold text-green-700 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
          ${formatCurrency(balance)}
        </p>
        <p className="text-xs text-green-500 mt-1">Click to fund wallet</p>
      </div>
      <div className="bg-orange-50 p-3 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
        <p className={`text-orange-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>In Escrow</p>
        <p className={`font-bold text-orange-700 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
          ${formatCurrency(escrowHeld)}
        </p>
        <p className="text-xs text-orange-500 mt-1">Funds held for active bets</p>
      </div>
    </div>
  );
};
