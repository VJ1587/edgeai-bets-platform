
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { WalletOnboarding } from '@/components/WalletOnboarding';
import { SmartBetInterface } from '@/components/SmartBetInterface';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useWallet } from '@/hooks/useWallet';
import { fetchLiveOdds, OddsData } from '@/services/oddsService';
import { Shield, TrendingUp, Users, Wallet } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { wallet, loading: walletLoading } = useWallet();
  const [games, setGames] = useState<OddsData[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);

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
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-2 gap-1 bg-card/50">
            <TabsTrigger 
              value="betting" 
              className="flex flex-col items-center gap-2 text-sm font-medium p-4 min-h-[60px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <TrendingUp className="h-5 w-5" />
              <span>Betting</span>
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
