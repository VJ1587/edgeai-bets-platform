
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const WalletStatus: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`mt-4 p-3 bg-blue-50 rounded-lg ${isMobile ? 'text-center' : ''}`}>
      <p className={`text-blue-600 ${isMobile ? 'text-xs' : 'text-xs'}`}>
        💰 Your wallet has been updated with $500,000 balance and $500,000 escrow. 
        {isMobile ? 'Tap refresh if needed.' : 'Click refresh if you don\'t see the latest amounts.'}
      </p>
    </div>
  );
};
