
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { WalletOnboarding } from '@/components/WalletOnboarding';
import { SmartBetInterface } from '@/components/SmartBetInterface';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useWallet } from '@/hooks/useWallet';
import { fetchLiveOdds, OddsData } from '@/services/oddsService';
import { Shield, TrendingUp, Users, Wallet } from 'lucide-react';
import Navigation from './Navigation';

const Layout = () => {
  const { user } = useAuth();
  const { wallet, loading: walletLoading } = useWallet();
  const [games, setGames] = useState<OddsData[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const location = useLocation();

  // Check if user is admin
  const isAdmin = user?.email === 'vimj1915@gmail.com' || user?.email?.includes('@edgestake.ai');

  // Don't show dashboard sections on landing page or auth pages
  const showDashboardSections = user && !location.pathname.includes('/landing') && !location.pathname.includes('/auth');

  useEffect(() => {
    if (showDashboardSections) {
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
    }
  }, [showDashboardSections]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {showDashboardSections ? (
        <div className="min-h-screen gradient-bg">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">EdgeStake Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.email}
              </p>
            </div>

            <Tabs defaultValue="betting" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="betting" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Betting
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Wallet
                </TabsTrigger>
                <TabsTrigger value="syndicates" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Syndicates
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="betting">
                {gamesLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <SmartBetInterface games={games} />
                )}
              </TabsContent>

              <TabsContent value="wallet">
                <div className="max-w-2xl">
                  <WalletOnboarding />
                </div>
              </TabsContent>

              <TabsContent value="syndicates">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Syndicate Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Join syndicate challenges or create your own pooled betting opportunities.
                    </p>
                    <SmartBetInterface games={games} />
                  </CardContent>
                </Card>
              </TabsContent>

              {isAdmin && (
                <TabsContent value="admin">
                  <AdminDashboard />
                </TabsContent>
              )}
            </Tabs>

            {/* Original page content */}
            <div className="mt-8">
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        <main className="pb-20">
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default Layout;
