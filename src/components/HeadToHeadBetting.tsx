
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  User, 
  Trophy, 
  Clock, 
  DollarSign,
  Plus,
  Target
} from 'lucide-react';
import { useBets } from '@/hooks/useBets';
import { useGroupChallenges } from '@/hooks/useGroupChallenges';
import { useBetPlacement } from '@/hooks/useBetPlacement';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { OddsData } from '@/services/oddsService';

interface HeadToHeadBettingProps {
  games: OddsData[];
}

export const HeadToHeadBetting: React.FC<HeadToHeadBettingProps> = ({ games }) => {
  const { user } = useAuth();
  const { wallet } = useWallet();
  const { bets } = useBets();
  const { challenges, createChallenge } = useGroupChallenges();
  const { placeBet, loading } = useBetPlacement();
  
  const [selectedGame, setSelectedGame] = useState<OddsData | null>(null);
  const [betType, setBetType] = useState<'1v1' | 'group'>('1v1');
  const [amount, setAmount] = useState('');
  const [selection, setSelection] = useState('');
  const [groupTitle, setGroupTitle] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [targetParticipants, setTargetParticipants] = useState('5');

  const handleCreate1v1Bet = async () => {
    if (!selectedGame || !amount || !selection) return;

    await placeBet({
      gameId: selectedGame.id,
      betType: 'head-to-head',
      selection,
      amount: parseFloat(amount),
      odds: '100',
      expiryHours: 24,
      description: `H2H: ${selection} - ${selectedGame.away_team} vs ${selectedGame.home_team}`
    });

    setAmount('');
    setSelection('');
  };

  const handleCreateGroupChallenge = async () => {
    if (!selectedGame || !amount || !groupTitle) return;

    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 48);

    await createChallenge({
      title: groupTitle,
      description: groupDescription,
      eventId: selectedGame.id,
      betType: 'group-challenge',
      targetAmount: parseFloat(amount) * parseInt(targetParticipants),
      entryFee: parseFloat(amount),
      maxParticipants: parseInt(targetParticipants),
      minParticipants: 2,
      expiryTime: expiryTime.toISOString()
    });

    setGroupTitle('');
    setGroupDescription('');
    setAmount('');
  };

  const openBets = bets.filter(bet => bet.status === 'open' && !bet.opponent_id);
  const activeChallenges = challenges.filter(challenge => challenge.status === 'open');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Head-to-Head Betting</h2>
        <Badge variant="outline" className="w-fit">
          {openBets.length} Open Challenges
        </Badge>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 gap-1">
          <TabsTrigger value="create" className="text-xs sm:text-sm py-3 px-2 min-h-[60px]">
            <div className="flex flex-col items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="1v1" className="text-xs sm:text-sm py-3 px-2 min-h-[60px]">
            <div className="flex flex-col items-center gap-1">
              <User className="h-4 w-4" />
              <span>1v1 Bets</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="groups" className="text-xs sm:text-sm py-3 px-2 min-h-[60px]">
            <div className="flex flex-col items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Group Challenges</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Create Challenge
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant={betType === '1v1' ? 'default' : 'outline'}
                  onClick={() => setBetType('1v1')}
                  className="min-h-[48px]"
                >
                  <User className="h-4 w-4 mr-2" />
                  1v1 Challenge
                </Button>
                <Button
                  variant={betType === 'group' ? 'default' : 'outline'}
                  onClick={() => setBetType('group')}
                  className="min-h-[48px]"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Group Challenge
                </Button>
              </div>

              <div>
                <Label htmlFor="game-select">Select Game</Label>
                <Select onValueChange={(value) => {
                  const game = games.find(g => g.id === value);
                  setSelectedGame(game || null);
                }}>
                  <SelectTrigger className="min-h-[48px]">
                    <SelectValue placeholder="Choose a game..." />
                  </SelectTrigger>
                  <SelectContent>
                    {games.slice(0, 10).map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.away_team} @ {game.home_team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {betType === '1v1' ? (
                <>
                  <div>
                    <Label htmlFor="selection">Your Pick</Label>
                    <Input
                      id="selection"
                      placeholder="e.g., Lakers to win"
                      value={selection}
                      onChange={(e) => setSelection(e.target.value)}
                      className="min-h-[48px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Bet Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="min-h-[48px]"
                    />
                  </div>
                  <Button 
                    onClick={handleCreate1v1Bet}
                    disabled={loading || !selectedGame || !amount || !selection}
                    className="w-full min-h-[48px]"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Create 1v1 Challenge
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="group-title">Challenge Title</Label>
                    <Input
                      id="group-title"
                      placeholder="Lakers vs Warriors Pool"
                      value={groupTitle}
                      onChange={(e) => setGroupTitle(e.target.value)}
                      className="min-h-[48px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="group-description">Description (Optional)</Label>
                    <Input
                      id="group-description"
                      placeholder="Winner takes all pool betting on the game"
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      className="min-h-[48px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="entry-fee">Entry Fee ($)</Label>
                      <Input
                        id="entry-fee"
                        type="number"
                        placeholder="50"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="min-h-[48px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="participants">Max Participants</Label>
                      <Select value={targetParticipants} onValueChange={setTargetParticipants}>
                        <SelectTrigger className="min-h-[48px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 Players</SelectItem>
                          <SelectItem value="5">5 Players</SelectItem>
                          <SelectItem value="10">10 Players</SelectItem>
                          <SelectItem value="20">20 Players</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button 
                    onClick={handleCreateGroupChallenge}
                    disabled={loading || !selectedGame || !amount || !groupTitle}
                    className="w-full min-h-[48px]"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Create Group Challenge
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="1v1">
          <div className="space-y-4">
            {openBets.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No open 1v1 challenges</p>
                  <p className="text-sm text-muted-foreground mt-2">Create your first challenge to get started!</p>
                </CardContent>
              </Card>
            ) : (
              openBets.map((bet) => (
                <Card key={bet.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-primary" />
                          <p className="font-medium">{bet.bet_selection}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>${bet.amount?.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Expires {new Date(bet.expiry_time || '').toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Badge variant={bet.status === 'open' ? 'default' : 'secondary'}>
                          {bet.status}
                        </Badge>
                        {bet.creator_id !== user?.id && (
                          <Button size="sm" className="min-h-[40px]">
                            Accept Challenge
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="groups">
          <div className="space-y-4">
            {activeChallenges.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No active group challenges</p>
                  <p className="text-sm text-muted-foreground mt-2">Create a group challenge to pool bets with others!</p>
                </CardContent>
              </Card>
            ) : (
              activeChallenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="font-medium text-lg">{challenge.title}</h3>
                      </div>
                      <Badge variant="outline">{challenge.bet_type}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-card/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Entry Fee</p>
                        <p className="font-bold text-lg text-primary">${challenge.entry_fee.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-3 bg-card/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Total Pool</p>
                        <p className="font-bold text-lg">${challenge.target_amount.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-3 bg-card/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Players</p>
                        <p className="font-bold text-lg text-yellow-400">
                          {Math.floor((challenge.current_amount || 0) / challenge.entry_fee)}/{challenge.max_participants}
                        </p>
                      </div>
                    </div>

                    {challenge.description && (
                      <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted/30 rounded-lg">
                        {challenge.description}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Expires: {new Date(challenge.expiry_time).toLocaleDateString()}</span>
                      </div>
                      <Button className="w-full sm:w-auto min-h-[48px]">
                        <Users className="h-4 w-4 mr-2" />
                        Join Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
