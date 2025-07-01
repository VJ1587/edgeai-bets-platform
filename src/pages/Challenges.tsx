
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
import { useWallet } from '@/hooks/useWallet';
import { useBets } from '@/hooks/useBets';

const Challenges = () => {
  const { user, userProfile } = useAuth();
  const { wallet } = useWallet();
  const { bets, groupBets, loading } = useBets();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('1v1');

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

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="px-4 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Challenges</h1>
            <p className="text-muted-foreground">Social betting & competitions</p>
          </div>
          {userProfile?.plan_type !== 'free' && (
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
                <p className="text-2xl font-bold text-green-400">
                  ${wallet?.balance?.toFixed(2) || '0.00'}
                </p>
                <Button variant="outline" size="sm" className="mt-1">
                  Add Funds
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Gate for Free Users */}
        {userProfile?.plan_type === 'free' && (
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
            {bets.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No 1v1 Challenges Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create or accept challenges to get started with peer-to-peer betting
                  </p>
                  {userProfile?.plan_type !== 'free' && (
                    <Button onClick={() => setShowCreateModal(true)}>
                      Create Challenge
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              bets.map((bet) => (
                <Card key={bet.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">{bet.status || 'pending'}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Expires {bet.expiry_time ? new Date(bet.expiry_time).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="mb-3">
                      <p className="font-medium">Event: {bet.event_id || 'Custom Bet'}</p>
                      <p className="text-sm text-muted-foreground">
                        Target: {bet.outcome || 'TBD'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-400">
                        ${bet.amount || 0} stake
                      </span>
                      <div className="flex gap-2">
                        {bet.status === 'pending' && bet.creator_id !== user?.id && (
                          <>
                            <Button size="sm" variant="outline">
                              Decline
                            </Button>
                            <Button size="sm">
                              Accept
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Group Bets */}
          <TabsContent value="groups" className="space-y-4">
            {groupBets.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No Group Bets Available</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Group bets allow multiple users to pool their money together
                  </p>
                  {userProfile?.plan_type !== 'free' && (
                    <Button onClick={() => setShowCreateModal(true)}>
                      Create Group Bet
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              groupBets.map((groupBet) => (
                <GroupBetCard 
                  key={groupBet.id} 
                  groupBet={{
                    id: groupBet.id,
                    title: `Event: ${groupBet.event_id || 'Custom'}`,
                    description: `Target: ${groupBet.target_outcome || 'TBD'}`,
                    currentAmount: groupBet.total_pot || 0,
                    targetAmount: (groupBet.total_pot || 0) * 2,
                    participants: Math.floor(Math.random() * 10) + 1,
                    maxParticipants: 20,
                    closesIn: groupBet.created_at ? new Date(groupBet.created_at).toLocaleDateString() : 'N/A'
                  }} 
                />
              ))
            )}
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
