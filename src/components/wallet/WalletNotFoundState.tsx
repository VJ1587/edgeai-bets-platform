
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, AlertCircle, RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WalletNotFoundStateProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export const WalletNotFoundState: React.FC<WalletNotFoundStateProps> = ({ onRefresh, refreshing }) => {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader className={`${isMobile ? 'p-4 pb-2' : ''}`}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : ''}`}>
          <Wallet className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          Wallet Not Found
        </CardTitle>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4 pt-2' : ''}`}>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={isMobile ? 'text-sm' : ''}>
            Your wallet should exist with $500,000 balance. There might be a data sync issue.
          </AlertDescription>
        </Alert>
        
        <Button onClick={onRefresh} disabled={refreshing} className="w-full">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Wallet Data'}
        </Button>
      </CardContent>
    </Card>
  );
};
