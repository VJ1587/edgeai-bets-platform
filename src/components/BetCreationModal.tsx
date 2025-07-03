
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertCircle, Calculator, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { supabase } from '@/integrations/supabase/client';
import { OddsData } from '@/services/oddsService';

interface BetCreationModalProps {
  game?: OddsData;
  market?: string;
  outcome?: any;
}

export const BetCreationModal: React.FC<BetCreationModalProps> = ({ game, market, outcome }) => {
  const { user } = useAuth();
  const { wallet } = useWallet();
  const [open, setOpen] = useState(false);
  const [betType, setBetType] = useState<'1v1' | 'syndicate'>('1v1');
  const [amount, setAmount] = useState('');
  const [vigPercent, setVigPercent] = useState('10');
  const [expiryHours, setExpiryHours] = useState('24');
  const [description, setDescription] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const betAmount = parseFloat(amount) || 0;
  const vig = parseFloat(vigPercent) || 0;
  const platformFee = betAmount * 0.025; // 2.5%
  const escrowFee = betAmount > 5000 ? betAmount * 0.01 : 0; // 1% for bets > $5000
  const totalFees = platformFee + escrowFee;
  const netPayout = betAmount - totalFees;

  const handleCreateBet = async () => {
    if (!user || !wallet) return;
    
    if (betAmount <= 0) {
      setError('Bet amount must be greater than $0');
      return;
    }

    if (betAmount > (wallet.balance || 0)) {
      setError('Insufficient wallet balance');
      return;
    }

    if (betAmount > 50000) {
      setError('Maximum bet amount is $50,000');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + parseInt(expiryHours));

      if (betType === '1v1') {
        // Create 1v1 bet
        const { error: betError } = await supabase
          .from('bets')
          .insert({
            creator_id: user.id,
            bet_type: market || 'straight',
            bet_selection: outcome ? `${outcome.name} ${outcome.price}` : description,
            amount: betAmount,
            odds: outcome?.price?.toString() || '100',
            event_id: game?.id || 'custom',
            vig_percent: vig,
            expiry_time: expiryTime.toISOString(),
            status: 'open'
          });

        if (betError) throw betError;

        // Update wallet balance (hold funds in escrow)
        const { error: walletError } = await supabase
          .from('user_wallets')
          .update({ 
            balance: (wallet.balance || 0) - betAmount,
            escrow_held: (wallet.escrow_held || 0) + betAmount
          })
          .eq('user_id', user.id);

        if (walletError) throw walletError;
      } else {
        // Create syndicate challenge
        const { error: challengeError } = await supabase
          .from('group_challenges')
          .insert({
            creator_id: user.id,
            title: `${game?.away_team} vs ${game?.home_team} - ${market}`,
            description: description || `${outcome?.name} at ${outcome?.price}`,
            event_id: game?.id || 'custom',
            bet_type: market || 'straight',
            target_amount: betAmount,
            entry_fee: Math.max(10, betAmount * 0.1), // 10% entry fee, min $10
            vig_percent: vig,
            expiry_time: expiryTime.toISOString()
          });

        if (challengeError) throw challengeError;
      }

      setOpen(false);
      setAmount('');
      setDescription('');
      window.location.reload(); // Refresh to show new bet
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bet');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Bet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Bet</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {game && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{game.away_team} @ {game.home_team}</p>
              {outcome && (
                <Badge variant="outline" className="mt-1">
                  {outcome.name}: {outcome.price > 0 ? '+' : ''}{outcome.price}
                </Badge>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={betType === '1v1' ? 'default' : 'outline'}
              onClick={() => setBetType('1v1')}
              size="sm"
            >
              1v1 Challenge
            </Button>
            <Button
              variant={betType === 'syndicate' ? 'default' : 'outline'}
              onClick={() => setBetType('syndicate')}
              size="sm"
            >
              Syndicate Pool
            </Button>
          </div>

          <div>
            <Label htmlFor="amount">
              {betType === '1v1' ? 'Bet Amount' : 'Target Pool Size'}
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max="50000"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="vig">Vig %</Label>
              <Input
                id="vig"
                type="number"
                value={vigPercent}
                onChange={(e) => setVigPercent(e.target.value)}
                min="0"
                max="50"
                step="0.5"
              />
            </div>
            <div>
              <Label htmlFor="expiry">Expires (hours)</Label>
              <Select value={expiryHours} onValueChange={setExpiryHours}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="72">3 days</SelectItem>
                  <SelectItem value="168">1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!game && (
            <div>
              <Label htmlFor="description">Bet Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your custom bet..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {betAmount > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span className="font-medium">Fee Breakdown</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Bet Amount:</span>
                  <span>${betAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee (2.5%):</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
                {escrowFee > 0 && (
                  <div className="flex justify-between">
                    <span>Escrow Fee (1%):</span>
                    <span>${escrowFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Net Payout:</span>
                  <span>${netPayout.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {betAmount > 5000 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Large wagers are subject to validation delays for security.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleCreateBet}
              disabled={processing || !amount || (!game && !description)}
              className="flex-1"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              {processing ? 'Creating...' : `Create ${betType === '1v1' ? '1v1' : 'Syndicate'} Bet`}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
