
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter } from 'lucide-react';
import { PickCard } from '@/components/PickCard';

const Picks = () => {
  const [selectedSport, setSelectedSport] = useState('all');
  
  // Mock picks data
  const picks = [
    {
      id: '1',
      title: 'Lakers vs Warriors - Lakers +5.5',
      explanation: 'Strong defensive matchup favors Lakers covering the spread. LeBron historically performs well against Warriors with home court advantage.',
      confidence: 87,
      betType: 'Spread',
      sport: 'NBA',
      odds: '+110',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Chiefs vs Bills Over 52.5',
      explanation: 'High-powered offenses with weak secondaries. Weather conditions favor passing game and both teams need offensive production.',
      confidence: 73,
      betType: 'Total',
      sport: 'NFL',
      odds: '-105',
      createdAt: new Date().toISOString(),
      isPremium: true
    },
    {
      id: '3',
      title: '3-Team NBA Parlay',
      explanation: 'Carefully selected combination of safe spread bets with high payout potential. All three teams have favorable matchups.',
      confidence: 65,
      betType: 'Parlay',
      sport: 'NBA',
      odds: '+485',
      createdAt: new Date().toISOString(),
      isPremium: true
    },
    {
      id: '4',
      title: 'Dodgers ML vs Padres',
      explanation: 'Starting pitcher advantage strongly favors Dodgers. Recent head-to-head matchups support this selection.',
      confidence: 81,
      betType: 'Moneyline',
      sport: 'MLB',
      odds: '-125',
      createdAt: new Date().toISOString(),
      isPremium: true
    }
  ];

  const sports = ['all', 'NBA', 'NFL', 'MLB'];
  const userPlan = 'Free';

  const filteredPicks = selectedSport === 'all' 
    ? picks 
    : picks.filter(pick => pick.sport === selectedSport);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="px-4 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">AI Picks</h1>
            <p className="text-muted-foreground">Expert predictions powered by AI</p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Sports Filter */}
        <Tabs value={selectedSport} onValueChange={setSelectedSport} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            {sports.map((sport) => (
              <TabsTrigger key={sport} value={sport} className="text-xs">
                {sport === 'all' ? 'All' : sport}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-6 p-4 bg-card rounded-lg">
          <div className="text-center">
            <p className="text-lg font-bold text-green-400">12</p>
            <p className="text-xs text-muted-foreground">Wins Today</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-400">4</p>
            <p className="text-xs text-muted-foreground">Losses</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">75%</p>
            <p className="text-xs text-muted-foreground">Win Rate</p>
          </div>
        </div>

        {/* Picks List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {selectedSport === 'all' ? 'All Picks' : `${selectedSport} Picks`}
            </h2>
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
    </div>
  );
};

export default Picks;
