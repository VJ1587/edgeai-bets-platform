
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WalletErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const WalletErrorState: React.FC<WalletErrorStateProps> = ({ error, onRetry }) => {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={isMobile ? 'text-sm' : ''}>
            Error loading wallet: {error}
            <Button onClick={onRetry} variant="outline" size="sm" className="ml-2">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
