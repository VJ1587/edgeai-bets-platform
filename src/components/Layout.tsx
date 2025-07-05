import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, Target, TrendingUp, Building, Gamepad2, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Layout = () => {
  const location = useLocation();
  const { userProfile } = useAuth();

  // Enhanced navigation items with new features
  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: Home, 
      description: 'AI Picks & Dashboard'
    },
    { 
      name: 'My Arena', 
      path: '/arena', 
      icon: Crown, 
      description: 'Elite Battle Arena'
    },
    { 
      name: 'Live Lines', 
      path: '/lines', 
      icon: TrendingUp, 
      description: 'Real-time Odds'
    },
    { 
      name: 'Challenges', 
      path: '/challenges', 
      icon: Users, 
      description: 'Social Betting'
    },
    { 
      name: 'AI Picks', 
      path: '/picks', 
      icon: Target, 
      description: 'Expert Predictions'
    }
  ];

  // Enhanced navigation for premium users
  const premiumNavItems = [
    { 
      name: 'Bookie Hub', 
      path: '/bookie-hub', 
      icon: Building, 
      description: 'Host & Manage Bets',
      premium: true
    },
    { 
      name: 'Simulations', 
      path: '/bet-simulation', 
      icon: Gamepad2, 
      description: 'Bet Flow Demos',
      premium: true
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isPremiumUser = userProfile?.plan_type !== 'free';

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Mobile Navigation */}
      <div className="lg:hidden">
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
          <nav className="flex justify-around py-2">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                    active
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="pb-20">
          <Outlet />
        </div>
      </div>

      {/* Enhanced Desktop Layout */}
      <div className="hidden lg:flex">
        <aside className="w-72 border-r border-border bg-card/30 backdrop-blur-sm">
          <div className="p-6">
            {/* Enhanced Brand Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  EdgeStake
                </h1>
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-xs text-muted-foreground italic">
                "Bet like a king. Win like a legend."
              </p>
            </div>

            {/* Enhanced Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                      active
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </Link>
                );
              })}

              {/* Premium Features */}
              {isPremiumUser && (
                <>
                  <div className="pt-4 pb-2">
                    <div className="flex items-center gap-2 px-4">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-600">Premium Features</span>
                    </div>
                  </div>
                  {premiumNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                          active
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md'
                            : 'text-muted-foreground hover:text-primary hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </>
              )}

              {/* Tier Badge */}
              <div className="pt-6">
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {userProfile?.plan_type || 'free'} Plan
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isPremiumUser ? 'Premium features unlocked' : 'Upgrade for more features'}
                  </p>
                </div>
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
