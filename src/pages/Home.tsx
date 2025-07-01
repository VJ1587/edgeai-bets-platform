
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Star, Zap } from 'lucide-react';
import { PickCard } from '@/components/PickCard';

const Home = () => {
  // Mock data - will be replaced with real data from Supabase
  const todaysPicks = [
    {
      id: '1',
      title: 'Lakers vs Warriors - Lakers +5.5',
      explanation: 'Strong defensive matchup favors Lakers covering the spread. LeBron historically performs well against Warriors.',
      confidence: 87,
      betType: 'Spread',
      sport: 'NBA',
      odds: '+110',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Chiefs vs Bills Over 52.5',
      explanation: 'High-powered offenses with weak secondaries. Weather conditions favor passing game.',
      confidence: 73,
      betType: 'Total',
      sport: 'NFL',
      odds: '-105',
      createdAt: new Date().toISOString(),
      isPremium: true
    },
    {
      id: '3',
      title: '3-Team Parlay Special',
      explanation: 'Carefully selected combination of safe bets with high payout potential.',
      confidence: 65,
      betType: 'Parlay',
      sport: 'Multi',
      odds: '+485',
      createdAt: new Date().toISOString(),
      isPremium: true
    }
  ];

  const userPlan = 'Free'; // Will come from auth context

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">EdgeStake.ai</h1>
            <p className="text-muted-foreground">AI-Powered Sports Betting</p>
          </div>
          <Badge variant="secondary" className="text-primary">
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
          <Badge variant="outline">
            {todaysPicks.length} Available
          </Badge>
        </div>
        
        <div className="space-y-4">
          {todaysPicks.map((pick, index) => (
            <PickCard
              key={pick.id}
              pick={pick}
              isLocked={pick.isPremium && userPlan === 'Free'}
            />
          ))}
        </div>
      </div>

      {/* Upgrade Banner */}
      {userPlan === 'Free' && (
        <div className="mx-4 mb-6">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Unlock Premium Picks</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get up to 15 AI picks daily with our Pro and Elite plans
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                View Plans
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Home;
