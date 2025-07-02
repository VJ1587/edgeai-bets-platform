
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { validateAndSanitizeText, validateBettingAmount } from '@/lib/validation';
import { toast } from '@/hooks/use-toast';

interface CreateChallengeModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({ open, onClose }) => {
  const [challengeType, setChallengeType] = useState('1v1');
  const [formData, setFormData] = useState({
    opponent: '',
    game: '',
    betType: '',
    stake: '',
    title: '',
    description: '',
    targetAmount: '',
    maxParticipants: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate and sanitize inputs
    const titleValidation = validateAndSanitizeText(formData.title, 100);
    const descriptionValidation = validateAndSanitizeText(formData.description, 500);
    const opponentValidation = validateAndSanitizeText(formData.opponent, 50);
    
    if (!titleValidation.isValid && formData.title) {
      toast({ variant: "destructive", description: titleValidation.error });
      return;
    }
    
    if (!descriptionValidation.isValid && formData.description) {
      toast({ variant: "destructive", description: descriptionValidation.error });
      return;
    }
    
    if (!opponentValidation.isValid && formData.opponent) {
      toast({ variant: "destructive", description: opponentValidation.error });
      return;
    }
    
    // Validate betting amounts
    if (formData.stake) {
      const stakeAmount = parseFloat(formData.stake);
      const stakeValidation = validateBettingAmount(stakeAmount);
      if (!stakeValidation.isValid) {
        toast({ variant: "destructive", description: stakeValidation.error });
        return;
      }
    }
    
    if (formData.targetAmount) {
      const targetAmount = parseFloat(formData.targetAmount);
      if (targetAmount < 50 || targetAmount > 50000) {
        toast({ variant: "destructive", description: "Target amount must be between $50 and $50,000" });
        return;
      }
    }
    
    // Create sanitized form data
    const sanitizedData = {
      type: challengeType,
      title: titleValidation.sanitized,
      description: descriptionValidation.sanitized,
      opponent: opponentValidation.sanitized,
      game: formData.game,
      betType: formData.betType,
      stake: formData.stake,
      targetAmount: formData.targetAmount,
      maxParticipants: formData.maxParticipants
    };
    
    console.log('Creating challenge:', sanitizedData);
    toast({ description: "Challenge created successfully!" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Challenge</DialogTitle>
        </DialogHeader>

        <Tabs value={challengeType} onValueChange={setChallengeType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1v1">1v1</TabsTrigger>
            <TabsTrigger value="group">Group</TabsTrigger>
            <TabsTrigger value="square">Square</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <TabsContent value="1v1" className="space-y-4">
              <div>
                <Label htmlFor="opponent">Opponent Username</Label>
                <Input
                  id="opponent"
                  value={formData.opponent}
                  onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="game">Game</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, game: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select game" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lakers-warriors">Lakers vs Warriors</SelectItem>
                    <SelectItem value="celtics-heat">Celtics vs Heat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="betType">Bet Type</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, betType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moneyline">Moneyline</SelectItem>
                    <SelectItem value="spread">Spread</SelectItem>
                    <SelectItem value="total">Total</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stake">Stake Amount ($)</Label>
                <Input
                  id="stake"
                  type="number"
                  value={formData.stake}
                  onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
                  placeholder="25"
                  min="1"
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="group" className="space-y-4">
              <div>
                <Label htmlFor="title">Group Bet Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Super Bowl Props Pool"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the group bet..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="targetAmount">Target Amount ($)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="1000"
                  min="50"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  placeholder="20"
                  min="2"
                  max="50"
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="square" className="space-y-4">
              <div>
                <Label htmlFor="gameTitle">Game Title</Label>
                <Input
                  id="gameTitle"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Lakers vs Celtics"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pricePerSquare">Price per Square ($)</Label>
                <Input
                  id="pricePerSquare"
                  type="number"
                  value={formData.stake}
                  onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
                  placeholder="10"
                  min="1"
                  required
                />
              </div>
            </TabsContent>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Challenge
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
