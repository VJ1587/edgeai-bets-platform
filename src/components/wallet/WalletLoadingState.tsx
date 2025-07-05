
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

export const WalletLoadingState: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className={`ml-2 text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
            Loading wallet...
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
