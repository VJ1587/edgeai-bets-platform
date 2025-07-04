
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WalletOnboarding } from '@/components/WalletOnboarding';
import { SmartBetInterface } from '@/components/SmartBetInterface';
import { HeadToHeadBetting } from '@/components/HeadToHeadBetting';
import { AdminDashboard } from '@/components/AdminDashboard';
import { OddsCard } from '@/components/OddsCard';
import { PickCard } from '@/components/PickCard';
import { useWallet } from '@/hooks/useWallet';
import { useBookieOperator } from '@/hooks/useBookieOperator';
import { fetchLiveOdds, OddsData } from '@/services/oddsService';
import { Shield, TrendingUp, Users, Wallet, Trophy, Crown, Building, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { wallet, loading: walletLoading } = useWallet();
  const { operator, isBookieOperator } = useBookieOperator();
  const [games, setGames] = useState<OddsData[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is admin
  const isAdmin = user?.email === 'vimj1915@gmail.com' || user?.email?.includes('@edgestake.ai');

  // Mock picks data
  const picks = [
    {
      id: '1',
      title: 'Las Vegas Aces vs Connecticut Sun - Aces -4.5',
      explanation: 'Aces are 12-3 at home this season with dominant paint presence. Sun struggling without key starter who is out with injury.',
      confidence: 89,
      betType: 'Spread',
      sport: 'WNBA',
      odds: '-110',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Dodgers vs Giants Over 9.5 Total Runs',
      explanation: 'Both bullpens have been shaky lately and Dodger Stadium plays well for hitters in July heat. Expect offensive explosion.',
      confidence: 81,
      betType: 'Total',
      sport: 'MLB',
      odds: '-105',
      createdAt: new Date().toISOString(),
      isPremium: true
    },
    {
      id: '3',
      title: 'Jon Jones vs Tom Aspinall - Under 2.5 Rounds',
      explanation: 'Jones historically finishes fights early against less experienced opponents. Aspinall aggressive style could lead to early finish.',
      confidence: 78,
      betType: 'Fight Props',
      sport: 'UFC',
      odds: '+145',
      createdAt: new Date().toISOString(),
      isPremium: true
    },
  ];

  const userPlan = 'Free';

  useEffect(() => {
    const loadGames = async () => {
      try {
        setGamesLoading(true);
        setError(null);
        const oddsData = await fetchLiveOdds();
        setGames(oddsData);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error loading games:', error);
        setError(error instanceof Error ? error.message : 'Failed to load odds');
      } finally {
        setGamesLoading(false);
      }
    };

    loadGames();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadGames, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const oddsData = await fetchLiveOdds();
      setGames(oddsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing odds:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh odds');
    } finally {
      setRefreshing(false);
    }
  };

  const handleBetClick = (game: OddsData, market: string, outcome: any) => {
    console.log('🎲 Bet clicked:', { game: game.id, market, outcome });
  };

  const sports = ['all', ...Array.from(new Set(games.map(game => game.sport_title)))];
  const filteredOdds = selectedSport === 'all' 
    ? games 
    : games.filter(game => game.sport_title === selectedSport);

  const filteredPicks = selectedSport === 'all' 
    ? picks 
    : picks.filter(pick => pick.sport === selectedSport);

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return lastUpdated.toLocaleTimeString();
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              Please sign in to access the dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-center sm:text-left">
            EdgeStake Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground text-center sm:text-left">
            Welcome back, {user.email}
          </p>
        </div>

        <Tabs defaultValue="betting" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 h-auto p-2 gap-1 bg-card/50">
            <TabsTrigger 
              value="betting" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[60px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <TrendingUp className="h-5 w-5" />
              <span>Betting</span>
            </TabsTrigger>
            <TabsTrigger 
              value="lines" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[60px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Live Lines</span>
            </TabsTrigger>
            <TabsTrigger 
              value="picks" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[60px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <Trophy className="h-5 w-5" />
              <span>AI Picks</span>
            </TabsTrigger>
            <TabsTrigger 
              value="h2h" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[60px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <Trophy className="h-5 w-5" />
              <span>Head-to-Head</span>
            </TabsTrigger>
            <TabsTrigger 
              value="wallet" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[60px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </TabsTrigger>
            <TabsTrigger 
              value="bookie" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[60px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <Building className="h-5 w-5" />
              <span>Bookie Hub</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger 
                value="admin" 
                className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[60px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
              >
                <Shield className="h-5 w-5" />
                <span>Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="betting" className="mt-6 space-y-0">
            {gamesLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <SmartBetInterface games={games} />
            )}
          </TabsContent>

          <TabsContent value="lines" className="mt-6">
            <div className="space-y-6">
              {/* Lines Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Live Lines</h2>
                  <p className="text-muted-foreground">Real-time betting odds</p>
                  {lastUpdated && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last updated: {formatLastUpdated()}
                    </p>
                  )}
                  {error && (
                    <p className="text-xs text-red-400 mt-1">Error: {error}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Sports Filter */}
              <div className="flex flex-wrap gap-2">
                {sports.map((sport) => (
                  <Button
                    key={sport}
                    variant={selectedSport === sport ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSport(sport)}
                  >
                    {sport === 'all' ? 'All Sports' : sport}
                  </Button>
                ))}
              </div>

              {/* Live Indicator */}
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-400">
                    Live Odds - Auto-updating every 30s
                  </span>
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {filteredOdds.length} Games
                </Badge>
              </div>

              {/* Lines List */}
              <div className="space-y-4">
                {filteredOdds.map((game) => (
                  <OddsCard
                    key={`${game.id}-${lastUpdated?.getTime()}`}
                    game={game}
                    onBetClick={handleBetClick}
                  />
                ))}
              </div>

              {filteredOdds.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No live odds available for {selectedSport === 'all' ? 'any sport' : selectedSport}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="picks" className="mt-6">
            <div className="space-y-6">
              {/* Picks Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">AI Picks</h2>
                  <p className="text-muted-foreground">Expert predictions powered by AI</p>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Sports Filter */}
              <div className="flex flex-wrap gap-2">
                {sports.map((sport) => (
                  <Button
                    key={sport}
                    variant={selectedSport === sport ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSport(sport)}
                  >
                    {sport === 'all' ? 'All Sports' : sport}
                  </Button>
                ))}
              </div>

              {/* Stats Bar */}
              <div className="flex items-center justify-between p-4 bg-card rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-400">15</p>
                  <p className="text-xs text-muted-foreground">Wins Today</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-400">6</p>
                  <p className="text-xs text-muted-foreground">Losses</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">71%</p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
              </div>

              {/* Picks List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {selectedSport === 'all' ? 'All Picks' : `${selectedSport} Picks`}
                  </h3>
                  <Badge variant="outline">
                    {filteredPicks.length} Available
                  </Badge>
                </div>
                
                {filteredPicks.map((pick) => (
                  <PickCard
                    key={pick.id}
                    pick={pick}
                    isLocked={pick.isPremium && userPlan === 'Free'}
                  />
                ))}
              </div>

              {filteredPicks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No picks available for {selectedSport}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="h2h" className="mt-6">
            {gamesLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <HeadToHeadBetting games={games} />
            )}
          </TabsContent>

          <TabsContent value="wallet" className="mt-6">
            <div className="max-w-full">
              <WalletOnboarding />
            </div>
          </TabsContent>

          <TabsContent value="bookie" className="mt-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Building className="h-5 w-5" />
                  Bookie Hub
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {isBookieOperator ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-800">Active Bookie Operator</h3>
                      </div>
                      <p className="text-green-700 mb-4">
                        You have an active bookie license: {operator?.business_name} ({operator?.tier})
                      </p>
                      <Button onClick={() => navigate('/bookie-dashboard')} className="w-full">
                        Access Bookie Dashboard
                      </Button>
                    </div>
                  </div>
                ) : operator?.status === 'pending' ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-semibold text-yellow-800 mb-2">Application Under Review</h3>
                      <p className="text-yellow-700">
                        Your bookie operator application is being reviewed. We'll notify you once it's approved.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Become a Bookie Operator</h3>
                      <p className="text-muted-foreground mb-6">
                        Join EdgeStake's elite network of licensed betting operators and create your own betting lines.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold mb-2">Starter</h4>
                        <p className="text-sm text-muted-foreground">$97/mo • $5K daily cap</p>
                      </div>
                      
                      <div className="text-center p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold mb-2">Pro</h4>
                        <p className="text-sm text-muted-foreground">$297/mo • $25K daily cap</p>
                      </div>
                      
                      <div className="text-center p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold mb-2">Elite</h4>
                        <p className="text-sm text-muted-foreground">$997/mo • $100K daily cap</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-blue-900 mb-2">Features Include:</h4>
                      <ul className="text-blue-800 text-sm space-y-1">
                        <li>• Create custom betting lines</li>
                        <li>• Manage syndicate pools</li>
                        <li>• Advanced analytics dashboard</li>
                        <li>• Automated escrow management</li>
                        <li>• API integrations (Elite tier)</li>
                      </ul>
                    </div>
                    
                    <Button onClick={() => navigate('/bookie-licensing')} className="w-full" size="lg">
                      Apply for Bookie License
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="mt-6">
              <AdminDashboard />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
