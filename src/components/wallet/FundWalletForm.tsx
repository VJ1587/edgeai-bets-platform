
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FundWalletFormProps {
  wallet: any;
  onFundingComplete: () => void;
}

export const FundWalletForm: React.FC<FundWalletFormProps> = ({ wallet, onFundingComplete }) => {
  const { user } = useAuth();
  const [fundAmount, setFundAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [localError, setLocalError] = useState('');
  const isMobile = useIsMobile();

  const handleFundWallet = async () => {
    if (!user || !fundAmount || !wallet) return;
    
    const amount = parseFloat(fundAmount);
    if (amount <= 0 || amount > 10000) {
      setLocalError('Amount must be between $1 and $10,000');
      return;
    }

    setProcessing(true);
    setLocalError('');

    try {
      const newBalance = (wallet.balance || 0) + amount;
      
      const { error } = await supabase
        .from('user_wallets')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setFundAmount('');
      onFundingComplete();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to fund wallet');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="fund-amount" className={isMobile ? 'text-sm' : ''}>
        Add Funds (Demo)
      </Label>
      <div className={`flex gap-2 ${isMobile ? 'flex-col' : ''}`}>
        <Input
          id="fund-amount"
          type="number"
          placeholder="Amount ($1 - $10,000)"
          value={fundAmount}
          onChange={(e) => setFundAmount(e.target.value)}
          min="1"
          max="10000"
          className={isMobile ? 'text-sm' : ''}
        />
        <Button 
          onClick={handleFundWallet}
          disabled={processing || !fundAmount}
          className={isMobile ? 'w-full' : ''}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {processing ? 'Adding...' : 'Add'}
        </Button>
      </div>

      {localError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={isMobile ? 'text-sm' : ''}>{localError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
