
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Trophy, Grid3x3, Plus, Coins } from 'lucide-react';
import { CreateChallengeModal } from '@/components/CreateChallengeModal';
import { GroupBetCard } from '@/components/GroupBetCard';
import { SquareCard } from '@/components/SquareCard';

const Challenges = () => {
  const { user, profile } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('1v1');

  const mockChallenges = [
    {
      id: '1',
      challenger: 'SportsBro22',
      game: 'Lakers vs Warriors',
      bet: 'Lakers -2.5',
      stake: 50,
      status: 'pending',
      expiresIn: '2 hours'
    }
  ];

  const mockGroupBets = [
    {
      id: '1',
      title: 'Super Bowl Props Pool',
      description: 'Group bet on various Super Bowl props',
      currentAmount: 850,
      targetAmount: 1000,
      participants: 17,
      maxParticipants: 20,
      closesIn: '3 days'
    }
  ];

  const mockSquares = [
    {
      id: '1',
      gameTitle: 'Lakers vs Celtics',
      pricePerSquare: 10,
      soldSquares: 67,
      totalSquares: 100,
      gameDate: '2025-01-15T20:00:00Z'
    }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <div className="px-4 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Challenges</h1>
            <p className="text-muted-foreground">Social betting & competitions</p>
          </div>
          {profile?.plan_type !== 'free' && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          )}
        </div>

        {/* Wallet Balance */}
        <Card className="mb-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-green-400" />
                <span className="font-medium">Wallet Balance</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">$125.50</p>
                <Button variant="outline" size="sm" className="mt-1">
                  Add Funds
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Gate for Free Users */}
        {profile?.plan_type === 'free' && (
          <Card className="mb-6 border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <h3 className="font-semibold mb-2">Upgrade to Join Challenges</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pro and Elite members can create and join betting challenges
              </p>
              <Button variant="outline" size="sm">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1v1" className="text-xs">
              <Users className="h-4 w-4 mr-1" />
              1v1
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs">
              <Trophy className="h-4 w-4 mr-1" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="squares" className="text-xs">
              <Grid3x3 className="h-4 w-4 mr-1" />
              Squares
            </TabsTrigger>
          </TabsList>

          {/* 1v1 Challenges */}
          <TabsContent value="1v1" className="space-y-4">
            {mockChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{challenge.status}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Expires in {challenge.expiresIn}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">{challenge.game}</p>
                    <p className="text-sm text-muted-foreground">
                      {challenge.challenger} challenges you on {challenge.bet}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-400">
                      ${challenge.stake} stake
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Decline
                      </Button>
                      <Button size="sm">
                        Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Group Bets */}
          <TabsContent value="groups" className="space-y-4">
            {mockGroupBets.map((groupBet) => (
              <GroupBetCard key={groupBet.id} groupBet={groupBet} />
            ))}
          </TabsContent>

          {/* Squares */}
          <TabsContent value="squares" className="space-y-4">
            {mockSquares.map((square) => (
              <SquareCard key={square.id} square={square} />
            ))}
          </TabsContent>
        </Tabs>

        {/* Create Challenge Modal */}
        <CreateChallengeModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />
      </div>
    </div>
  );
};

export default Challenges;
