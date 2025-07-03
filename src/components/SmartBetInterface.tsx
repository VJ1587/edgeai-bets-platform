
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { OddsData } from '@/services/oddsService';
import { BetCreationModal } from './BetCreationModal';
import { useBets } from '@/hooks/useBets';
import { useGroupChallenges } from '@/hooks/useGroupChallenges';
import { useWallet } from '@/hooks/useWallet';

interface SmartBetInterfaceProps {
  games: OddsData[];
}

export const SmartBetInterface: React.FC<SmartBetInterfaceProps> = ({ games }) => {
  const { bets, loading: betsLoading } = useBets();
  const { challenges, loading: challengesLoading } = useGroupChallenges();
  const { wallet } = useWallet();
  const [selectedGame, setSelectedGame] = useState<OddsData | null>(null);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatOdds = (price: number) => {
    return price > 0 ? `+${price}` : `${price}`;
  };

  if (betsLoading || challengesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Smart Betting Interface</h2>
        {wallet && (
          <div className="text-sm text-muted-foreground bg-card/50 p-3 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:gap-4 gap-1">
              <span>Balance: <strong className="text-primary">${wallet.balance?.toFixed(2) || '0.00'}</strong></span>
              <span>Escrow: <strong className="text-yellow-400">${wallet.escrow_held?.toFixed(2) || '0.00'}</strong></span>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="games" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 gap-1">
          <TabsTrigger value="games" className="text-xs sm:text-sm py-3 px-2">Live Games</TabsTrigger>
          <TabsTrigger value="1v1" className="text-xs sm:text-sm py-3 px-2">My 1v1 Bets</TabsTrigger>
          <TabsTrigger value="syndicates" className="text-xs sm:text-sm py-3 px-2">Available Syndicates</TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm py-3 px-2">Bet History</TabsTrigger>
        </TabsList>

        <TabsContent value="games">
          <div className="grid gap-6">
            {games.slice(0, 6).map((game) => (
              <Card key={game.id} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      {game.sport_title}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatTime(game.commence_time)}
                    </div>
                  </div>

                  <div className="text-center mb-6 space-y-2">
                    <p className="font-semibold text-lg">{game.away_team}</p>
                    <p className="text-muted-foreground">@</p>
                    <p className="font-semibold text-lg">{game.home_team}</p>
                  </div>

                  {game.bookmakers?.[0]?.markets?.find(m => m.key === 'h2h') && (
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-muted-foreground text-center">Moneyline</p>
                      <div className="grid grid-cols-2 gap-4">
                        {game.bookmakers[0].markets.find(m => m.key === 'h2h')?.outcomes.slice(0, 2).map((outcome, index) => (
                          <div key={index} className="text-center p-4 border rounded-lg bg-card/30 hover:bg-card/50 transition-colors">
                            <p className="text-sm font-medium mb-2 truncate">{outcome.name.split(' ').pop()}</p>
                            <p className="font-bold text-lg mb-3">{formatOdds(outcome.price)}</p>
                            <BetCreationModal 
                              game={game} 
                              market="moneyline" 
                              outcome={outcome} 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t flex justify-center">
                    <BetCreationModal game={game} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="1v1">
          <div className="space-y-4">
            {bets.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No active 1v1 bets</p>
                </CardContent>
              </Card>
            ) : (
              bets.map((bet) => (
                <Card key={bet.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <p className="font-medium text-lg">{bet.bet_selection}</p>
                        <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 text-sm text-muted-foreground">
                          <span>Amount: <strong>${bet.amount?.toFixed(2)}</strong></span>
                          <span>Odds: <strong>{bet.odds}</strong></span>
                        </div>
                      </div>
                      <Badge variant={bet.status === 'open' ? 'default' : 'secondary'} className="w-fit">
                        {bet.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="syndicates">
          <div className="space-y-6">
            {challenges.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No active syndicate challenges</p>
                </CardContent>
              </Card>
            ) : (
              challenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                      <h3 className="font-medium text-lg">{challenge.title}</h3>
                      <Badge variant="outline" className="w-fit">{challenge.bet_type}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-4 bg-card/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Target</p>
                        <p className="font-bold text-xl text-primary">${challenge.target_amount.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-4 bg-card/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Current</p>
                        <p className="font-bold text-xl">${challenge.current_amount?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="text-center p-4 bg-card/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Entry Fee</p>
                        <p className="font-bold text-xl text-yellow-400">${challenge.entry_fee.toFixed(2)}</p>
                      </div>
                    </div>

                    {challenge.description && (
                      <p className="text-sm text-muted-foreground mb-4 p-4 bg-muted/30 rounded-lg">
                        {challenge.description}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className="text-sm text-muted-foreground">
                        Expires: {new Date(challenge.expiry_time).toLocaleDateString()}
                      </span>
                      <Button size="lg" className="w-full sm:w-auto">
                        <Users className="h-4 w-4 mr-2" />
                        Join Syndicate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Betting History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Your completed bets and payouts will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {games.length > 0 && (
        <Alert className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Large wagers (>$5,000) are subject to validation delays. 
            Platform fee: 2.5% | Escrow fee: 1% (on bets >$5,000)
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
