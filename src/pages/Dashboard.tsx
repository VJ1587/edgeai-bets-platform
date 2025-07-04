
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Calendar, 
  Filter,
  RefreshCw,
  Target,
  Trophy,
  Crown,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchLiveOdds, OddsData } from '@/services/oddsService';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Pick {
  id: string;
  title: string;
  sport: string;
  bet_type: string;
  odds: string;
  confidence: number;
  explanation: string;
  is_premium: boolean;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch live odds
  const { data: games = [], isLoading: gamesLoading, refetch: refetchGames } = useQuery({
    queryKey: ['live-odds', refreshKey],
    queryFn: fetchLiveOdds,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Fetch AI picks
  const { data: picks = [], isLoading: picksLoading } = useQuery({
    queryKey: ['picks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('picks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Pick[];
    },
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetchGames();
  };

  // Filter games by sport
  const filteredGames = games.filter(game => 
    selectedSport === 'all' || game.sport_key === selectedSport
  );

  // Get unique sports for filter
  const sports = Array.from(new Set(games.map(game => game.sport_key)));

  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : odds.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Elite Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              EdgeStake Elite Dashboard
            </h1>
            <Crown className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-lg text-muted-foreground">Welcome back, Champion</p>
          <p className="text-sm text-muted-foreground mt-2 italic">
            "Bet like a king. Win like a legend."
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">47</p>
              <p className="text-sm text-muted-foreground">Active Lines</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-muted-foreground">AI Picks Today</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">89%</p>
              <p className="text-sm text-muted-foreground">Win Rate</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">+$2.1K</p>
              <p className="text-sm text-muted-foreground">Weekly P&L</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {sports.map(sport => (
                <SelectItem key={sport} value={sport}>
                  {sport.replace(/_/g, ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={handleRefresh} disabled={gamesLoading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${gamesLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        <Tabs defaultValue="lines" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lines" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Live Lines ({filteredGames.length})
            </TabsTrigger>
            <TabsTrigger value="picks" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              AI Picks ({picks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lines">
            {gamesLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredGames.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No games available for the selected sport.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <Card key={game.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {game.sport_key.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(game.start_time)}
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {game.match_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {game.odds && Object.entries(game.odds).length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Latest Odds:</p>
                          <div className="grid grid-cols-1 gap-2">
                            {Object.entries(game.odds).slice(0, 3).map(([market, odds]) => (
                              <div key={market} className="flex justify-between items-center p-2 bg-muted rounded">
                                <span className="text-sm">{market}</span>
                                <Badge variant="outline" className="font-mono">
                                  {typeof odds === 'number' ? formatOdds(odds) : 'N/A'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No odds available</p>
                      )}
                      
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Place Bet
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="picks">
            {picksLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : picks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No AI picks available.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {picks.map((pick) => (
                  <Card key={pick.id} className={`hover:shadow-lg transition-shadow ${
                    pick.is_premium ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : ''
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {pick.sport.toUpperCase()}
                        </Badge>
                        {pick.is_premium && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            ⭐ Premium
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {pick.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {pick.bet_type}
                        </Badge>
                        <Badge variant="outline" className="font-mono text-xs">
                          {pick.odds}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Confidence:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                              style={{ width: `${pick.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-green-600">
                            {pick.confidence}%
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {pick.explanation}
                      </p>
                      
                      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                        Follow Pick
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
