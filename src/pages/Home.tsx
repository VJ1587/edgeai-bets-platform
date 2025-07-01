import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Star, Zap } from 'lucide-react';
import { PickCard } from '@/components/PickCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { userProfile } = useAuth();
  const [picks, setPicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPicks = async () => {
      // Use mock data for current sports in season (July 2025)
      const mockPicks = [
        {
          id: '1',
          title: 'Las Vegas Aces vs New York Liberty',
          sport: 'WNBA',
          bet_type: 'Moneyline',
          odds: '-140',
          confidence: 87,
          explanation: 'The Aces are dominating at home this season with A\'ja Wilson leading MVP race. Liberty struggling on road games.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_premium: false
        },
        {
          id: '2',
          title: 'Los Angeles Dodgers vs San Francisco Giants',
          sport: 'MLB',
          bet_type: 'Run Line',
          odds: '-1.5 (-110)',
          confidence: 82,
          explanation: 'Dodgers have won 8 of last 10 against Giants. Mookie Betts is heating up and their bullpen is elite.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_premium: false
        },
        {
          id: '3',
          title: 'Jon Jones vs Stipe Miocic',
          sport: 'UFC',
          bet_type: 'Moneyline',
          odds: '-180',
          confidence: 91,
          explanation: 'Jones has incredible reach advantage and wrestling dominance. Miocic coming off long layoff.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_premium: true
        },
        {
          id: '4',
          title: 'New York Yankees vs Boston Red Sox',
          sport: 'MLB',
          bet_type: 'Over/Under',
          odds: 'Over 8.5 (-110)',
          confidence: 79,
          explanation: 'Both teams have been scoring heavily lately. Fenway Park favorable for hitters in summer conditions.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_premium: false
        },
        {
          id: '5',
          title: 'Connecticut Sun vs Seattle Storm',
          sport: 'WNBA',
          bet_type: 'Spread',
          odds: '+2.5 (-110)',
          confidence: 85,
          explanation: 'Sun playing exceptional defense at home. Storm missing key player due to injury.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_premium: true
        },
        {
          id: '6',
          title: 'Canelo Alvarez vs Jermall Charlo',
          sport: 'Boxing',
          bet_type: 'Method of Victory',
          odds: 'Canelo by Decision (+150)',
          confidence: 76,
          explanation: 'Both fighters prefer to box rather than brawl. Expect tactical 12-round fight.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_premium: true
        }
      ];

      setPicks(mockPicks);
      setLoading(false);
    };

    fetchPicks();
  }, []);

  const userPlan = userProfile?.plan_type || 'free';
  
  // Define pick limits based on plan
  const getPickLimit = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 5;
      case 'elite':
        return 15;
      default:
        return 1;
    }
  };

  const pickLimit = getPickLimit(userPlan);
  const displayedPicks = picks.slice(0, pickLimit);

  const handleUpgrade = async (planType: 'pro' | 'elite') => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading picks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">EdgeStake.ai</h1>
            <p className="text-muted-foreground">AI-Powered Sports Betting</p>
          </div>
          <Badge variant="secondary" className="text-primary capitalize">
            {userPlan} Plan
          </Badge>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-400">74%</p>
              <p className="text-xs text-muted-foreground">Win Rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">+247%</p>
              <p className="text-xs text-muted-foreground">ROI</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's Picks */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Today's Picks</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {displayedPicks.length} of {pickLimit}
            </Badge>
            {userPlan === 'free' && (
              <Badge variant="secondary" className="text-yellow-400">
                Limited
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {displayedPicks.map((pick) => (
            <PickCard
              key={pick.id}
              pick={pick}
            />
          ))}
        </div>

        {/* Show upgrade prompt if user has reached their limit */}
        {picks.length > pickLimit && (
          <div className="mt-4 p-4 bg-card rounded-lg border border-yellow-500/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {picks.length - pickLimit} more picks available
              </p>
              <p className="text-xs text-yellow-400">
                Upgrade to see all picks
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Plan-specific Upgrade Banners */}
      {userPlan === 'free' && (
        <div className="mx-4 mb-6 space-y-4">
          <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Upgrade to Pro</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Get 5 AI picks daily for just $29/month
              </p>
              <p className="text-xs text-blue-400 mb-4">
                5x more winning opportunities
              </p>
              <Button 
                onClick={() => handleUpgrade('pro')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                Upgrade to Pro - $29/mo
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Go Elite</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Get 15 AI picks daily + challenges for $97/month
              </p>
              <p className="text-xs text-purple-400 mb-4">
                Maximum winning potential + social features
              </p>
              <Button 
                onClick={() => handleUpgrade('elite')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                Upgrade to Elite - $97/mo
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {userPlan === 'pro' && (
        <div className="mx-4 mb-6">
          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Unlock Elite Features</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Get 15 picks daily + challenges + group betting
              </p>
              <p className="text-xs text-purple-400 mb-4">
                3x more picks + social betting features
              </p>
              <Button 
                onClick={() => handleUpgrade('elite')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                Upgrade to Elite - $97/mo
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Home;
