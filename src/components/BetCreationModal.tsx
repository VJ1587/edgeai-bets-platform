import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertCircle, Calculator, DollarSign, Share } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { useBetPlacement } from '@/hooks/useBetPlacement';
import { ShareModal } from '@/components/ShareModal';
import { OddsData } from '@/services/oddsService';

interface BetCreationModalProps {
  game?: OddsData;
  market?: string;
  outcome?: any;
}

export const BetCreationModal: React.FC<BetCreationModalProps> = ({ game, market, outcome }) => {
  const { user } = useAuth();
  const { wallet } = useWallet();
  const { placeBet, loading } = useBetPlacement();
  const [open, setOpen] = useState(false);
  const [betType, setBetType] = useState<'1v1' | 'syndicate'>('1v1');
  const [amount, setAmount] = useState('');
  const [vigPercent, setVigPercent] = useState('10');
  const [expiryHours, setExpiryHours] = useState('24');
  const [description, setDescription] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [createdBetId, setCreatedBetId] = useState<string>('');

  const betAmount = parseFloat(amount) || 0;
  const vig = parseFloat(vigPercent) || 0;
  const platformFee = betAmount * 0.025; // 2.5%
  const escrowFee = betAmount > 5000 ? betAmount * 0.01 : 0; // 1% for bets > $5000
  const totalCost = betAmount + platformFee + escrowFee;

  const handleCreateBet = async () => {
    if (!user || !wallet) return;
    
    if (betAmount <= 0) {
      return;
    }

    if (betAmount > (wallet.balance || 0)) {
      return;
    }

    const selection = outcome ? `${outcome.name} ${outcome.price}` : description;
    const odds = outcome?.price?.toString() || '100';

    const result = await placeBet({
      gameId: game?.id || 'custom',
      betType: market || 'straight',
      selection,
      amount: betAmount,
      odds,
      vigPercent: vig,
      expiryHours: parseInt(expiryHours),
      description
    });

    if (result) {
      setCreatedBetId(result.id);
      setOpen(false);
      setShowShareModal(true);
      setAmount('');
      setDescription('');
    }
  };

  return (
    <>
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
              <Label htmlFor="amount">Bet Amount</Label>
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
                  <span className="font-medium">Cost Breakdown</span>
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
                    <span>Total Cost:</span>
                    <span>${totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Your Balance:</span>
                    <span>${(wallet?.balance || 0).toFixed(2)}</span>
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

            {totalCost > (wallet?.balance || 0) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Insufficient balance. You need ${totalCost.toFixed(2)} but only have ${(wallet?.balance || 0).toFixed(2)}.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleCreateBet}
                disabled={loading || !amount || (!game && !description) || totalCost > (wallet?.balance || 0)}
                className="flex-1"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                {loading ? 'Creating...' : `Place $${betAmount.toFixed(2)} Bet`}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        betId={createdBetId}
        betType={betType === '1v1' ? 'duel' : 'syndicate'}
        amount={betAmount}
        title={game ? `${game.away_team} @ ${game.home_team}` : description}
      />
    </>
  );
};
