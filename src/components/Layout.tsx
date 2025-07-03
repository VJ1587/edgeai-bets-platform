
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
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
            <div className="mb-4 sm:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">EdgeStake Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Welcome back, {user.email}
              </p>
            </div>

            <Tabs defaultValue="betting" className="space-y-4 sm:space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
                <TabsTrigger value="betting" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Betting</span>
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                  <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Wallet</span>
                </TabsTrigger>
                <TabsTrigger value="syndicates" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Syndicates</span>
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="admin" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Admin</span>
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="betting" className="mt-4 sm:mt-6">
                {gamesLoading ? (
                  <div className="flex items-center justify-center p-6 sm:p-8">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <SmartBetInterface games={games} />
                )}
              </TabsContent>

              <TabsContent value="wallet" className="mt-4 sm:mt-6">
                <div className="max-w-full sm:max-w-2xl">
                  <WalletOnboarding />
                </div>
              </TabsContent>

              <TabsContent value="syndicates" className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                      Syndicate Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <p className="text-sm sm:text-base text-muted-foreground mb-4">
                      Join syndicate challenges or create your own pooled betting opportunities.
                    </p>
                    <SmartBetInterface games={games} />
                  </CardContent>
                </Card>
              </TabsContent>

              {isAdmin && (
                <TabsContent value="admin" className="mt-4 sm:mt-6">
                  <AdminDashboard />
                </TabsContent>
              )}
            </Tabs>

            {/* Original page content */}
            <div className="mt-6 sm:mt-8">
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        <main className="pb-16 sm:pb-20">
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default Layout;
