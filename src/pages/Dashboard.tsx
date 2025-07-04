
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { WalletOnboarding } from '@/components/WalletOnboarding';
import { SmartBetInterface } from '@/components/SmartBetInterface';
import { HeadToHeadBetting } from '@/components/HeadToHeadBetting';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useWallet } from '@/hooks/useWallet';
import { useBookieOperator } from '@/hooks/useBookieOperator';
import { fetchLiveOdds, OddsData } from '@/services/oddsService';
import { Shield, TrendingUp, Users, Wallet, Trophy, Crown, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { wallet, loading: walletLoading } = useWallet();
  const { operator, isBookieOperator } = useBookieOperator();
  const [games, setGames] = useState<OddsData[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is admin (simplified check - in production would check profiles table)
  const isAdmin = user?.email === 'vimj1915@gmail.com' || user?.email?.includes('@edgestake.ai');

  useEffect(() => {
    const loadGames = async () => {
      try {
        setGamesLoading(true);
        const oddsData = await fetchLiveOdds();
        setGames(oddsData);
      } catch (error) {
        console.error('Error loading games:', error);
      } finally {
        setGamesLoading(false);
      }
    };

    loadGames();
  }, []);

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
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-2 gap-1 bg-card/50">
            <TabsTrigger 
              value="betting" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[60px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <TrendingUp className="h-5 w-5" />
              <span>Betting</span>
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
              value="syndicates" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[60px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <Users className="h-5 w-5" />
              <span>Syndicates</span>
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

          <TabsContent value="syndicates" className="mt-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Users className="h-5 w-5" />
                  Syndicate Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  Join syndicate challenges or create your own pooled betting opportunities.
                </p>
                <SmartBetInterface games={games} />
              </CardContent>
            </Card>
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
                        <h4 className="font-semibold mb-2">Local Bookie</h4>
                        <p className="text-sm text-muted-foreground">$249/mo • $5K daily cap</p>
                      </div>
                      
                      <div className="text-center p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold mb-2">Regional Host</h4>
                        <p className="text-sm text-muted-foreground">$499/mo • $25K daily cap</p>
                      </div>
                      
                      <div className="text-center p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold mb-2">Elite Operator</h4>
                        <p className="text-sm text-muted-foreground">$999/mo • $100K daily cap</p>
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
