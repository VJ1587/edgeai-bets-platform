
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Smart Betting Interface</h2>
        {wallet && (
          <div className="text-sm text-muted-foreground">
            Balance: ${wallet.balance?.toFixed(2) || '0.00'} | 
            Escrow: ${wallet.escrow_held?.toFixed(2) || '0.00'}
          </div>
        )}
      </div>

      <Tabs defaultValue="games" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="games">Live Games</TabsTrigger>
          <TabsTrigger value="1v1">My 1v1 Bets</TabsTrigger>
          <TabsTrigger value="syndicates">Available Syndicates</TabsTrigger>
          <TabsTrigger value="history">Bet History</TabsTrigger>
        </TabsList>

        <TabsContent value="games">
          <div className="grid gap-4">
            {games.slice(0, 6).map((game) => (
              <Card key={game.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {game.sport_title}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(game.commence_time)}
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <p className="font-medium">{game.away_team}</p>
                    <p className="text-xs text-muted-foreground">@</p>
                    <p className="font-medium">{game.home_team}</p>
                  </div>

                  {game.bookmakers?.[0]?.markets?.find(m => m.key === 'h2h') && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Moneyline</p>
                      <div className="grid grid-cols-2 gap-2">
                        {game.bookmakers[0].markets.find(m => m.key === 'h2h')?.outcomes.slice(0, 2).map((outcome, index) => (
                          <div key={index} className="text-center p-2 border rounded">
                            <p className="text-xs truncate">{outcome.name.split(' ').pop()}</p>
                            <p className="font-bold text-sm">{formatOdds(outcome.price)}</p>
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

                  <div className="mt-3 pt-2 border-t">
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
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No active 1v1 bets</p>
                </CardContent>
              </Card>
            ) : (
              bets.map((bet) => (
                <Card key={bet.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{bet.bet_selection}</p>
                        <p className="text-sm text-muted-foreground">
                          Amount: ${bet.amount?.toFixed(2)} | Odds: {bet.odds}
                        </p>
                      </div>
                      <Badge variant={bet.status === 'open' ? 'default' : 'secondary'}>
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
          <div className="space-y-4">
            {challenges.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No active syndicate challenges</p>
                </CardContent>
              </Card>
            ) : (
              challenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{challenge.title}</h3>
                      <Badge variant="outline">{challenge.bet_type}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="font-bold">${challenge.target_amount.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className="font-bold">${challenge.current_amount?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Entry Fee</p>
                        <p className="font-bold">${challenge.entry_fee.toFixed(2)}</p>
                      </div>
                    </div>

                    {challenge.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {challenge.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Expires: {new Date(challenge.expiry_time).toLocaleDateString()}
                      </span>
                      <Button size="sm">
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Betting History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your completed bets and payouts will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {games.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Large wagers ({'>'}$5,000) are subject to validation delays. 
            Platform fee: 2.5% | Escrow fee: 1% (on bets {'>'}$5,000)
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
