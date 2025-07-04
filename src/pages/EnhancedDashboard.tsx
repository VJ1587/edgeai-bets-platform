
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Sword, 
  Users, 
  TrendingUp, 
  Shield,
  Zap,
  Trophy,
  Target
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TierBadge } from '@/components/enhanced/TierBadge';
import { ChallengeTypeCard } from '@/components/enhanced/ChallengeTypeCard';
import { DemoEventCard } from '@/components/enhanced/DemoEventCard';
import { EscrowStatus } from '@/components/enhanced/EscrowStatus';
import { challengeTypes } from '@/data/challengeTypes';
import { demoEvents } from '@/data/demoEvents';
import type { ChallengeType, DemoEvent, UserTier } from '@/types/edgestake';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('arena');
  
  // Mock user tier - in real app this would come from user profile
  const userTier: UserTier['level'] = 'Elite';
  
  // Mock escrow transaction
  const mockEscrow = {
    id: '1',
    amount: 2500,
    status: 'locked' as const,
    platformFee: 62.50,
    escrowFee: 25,
    createdAt: new Date().toISOString()
  };

  const handleChallengeSelect = (challenge: ChallengeType) => {
    console.log('Selected challenge:', challenge);
    // Navigate to challenge page or open modal
  };

  const handleEventBet = (event: DemoEvent) => {
    console.log('Betting on event:', event);
    // Open betting interface
  };

  const featuredEvents = demoEvents.filter(event => event.featured);
  const upcomingEvents = demoEvents.filter(event => !event.featured).slice(0, 6);

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-6">
            <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome to EdgeStake</h2>
            <p className="text-muted-foreground mb-4">
              Bet like a king. Win like a legend.
            </p>
            <Button className="w-full">Sign In to Enter The Arena</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              EdgeStake Arena
            </h1>
            <Crown className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="flex justify-center items-center gap-4">
            <p className="text-lg text-muted-foreground">Welcome back, Champion</p>
            <TierBadge tier={userTier} />
          </div>
          <p className="text-sm text-muted-foreground mt-2 italic">
            "Enter The Pit. Rise to Kingship."
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-sm text-muted-foreground">Wins Today</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">73%</p>
              <p className="text-sm text-muted-foreground">Win Rate</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">5</p>
              <p className="text-sm text-muted-foreground">Active Bets</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">$8.2K</p>
              <p className="text-sm text-muted-foreground">In Escrow</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-2 gap-1 bg-card/50">
            <TabsTrigger 
              value="arena" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[80px]"
            >
              <Sword className="h-6 w-6" />
              <span>Battle Arena</span>
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[80px]"
            >
              <TrendingUp className="h-6 w-6" />
              <span>Live Events</span>
            </TabsTrigger>
            <TabsTrigger 
              value="escrow" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[80px]"
            >
              <Shield className="h-6 w-6" />
              <span>Escrow</span>
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[80px]"
            >
              <Users className="h-6 w-6" />
              <span>Rankings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="arena" className="mt-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Choose Your Battle</h2>
                <p className="text-muted-foreground">Select your challenge type and prove your worth</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challengeTypes.map((challenge) => (
                  <ChallengeTypeCard
                    key={challenge.id}
                    challenge={challenge}
                    onSelect={handleChallengeSelect}
                    featured={challenge.id === 'kingmaker'}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">🔥 Featured Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredEvents.map((event) => (
                    <DemoEventCard
                      key={event.id}
                      event={event}
                      onBet={handleEventBet}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <DemoEventCard
                      key={event.id}
                      event={event}
                      onBet={handleEventBet}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="escrow" className="mt-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Escrow Vault</h2>
                <p className="text-muted-foreground">Your secured funds and transaction history</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EscrowStatus transaction={mockEscrow} />
                <Card>
                  <CardHeader>
                    <CardTitle>Fee Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Platform Fee</span>
                      <span className="font-medium">2.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Escrow Fee ({'>'}$5K)</span>
                      <span className="font-medium">+1%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Syndicate Fee</span>
                      <span className="font-medium">0.5% - 2%</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-medium">
                        <span>Daily Payout Limit</span>
                        <span>$100K</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Hall of Champions</h2>
                <p className="text-muted-foreground">Top performers in the EdgeStake Arena</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { rank: 1, name: 'KingSlayer_X', tier: 'KingMaker' as const, wins: 47, winRate: '89%' },
                      { rank: 2, name: 'Arena_Champion', tier: 'Elite' as const, wins: 42, winRate: '84%' },
                      { rank: 3, name: 'BetMaster_Pro', tier: 'Elite' as const, wins: 38, winRate: '79%' },
                      { rank: 4, name: 'You', tier: userTier, wins: 32, winRate: '73%' },
                    ].map((player) => (
                      <div key={player.rank} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                            #{player.rank}
                          </Badge>
                          <div>
                            <p className="font-medium">{player.name}</p>
                            <TierBadge tier={player.tier} size="sm" />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{player.wins} wins</p>
                          <p className="text-sm text-muted-foreground">{player.winRate} rate</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
