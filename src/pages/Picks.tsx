
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter } from 'lucide-react';
import { PickCard } from '@/components/PickCard';

const Picks = () => {
  const [selectedSport, setSelectedSport] = useState('all');
  
  // Mock picks data for current sports in season (July 2025)
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
      title: '3-Team Baseball Parlay',
      explanation: 'Carefully selected combination of moneyline favorites with strong starting pitchers. All three teams have favorable matchups.',
      confidence: 71,
      betType: 'Parlay',
      sport: 'MLB',
      odds: '+285',
      createdAt: new Date().toISOString(),
      isPremium: true
    },
    {
      id: '4',
      title: 'Jon Jones vs Tom Aspinall - Under 2.5 Rounds',
      explanation: 'Jones historically finishes fights early against less experienced opponents. Aspinall aggressive style could lead to early finish.',
      confidence: 78,
      betType: 'Fight Props',
      sport: 'UFC',
      odds: '+145',
      createdAt: new Date().toISOString(),
      isPremium: true
    },
    {
      id: '5',
      title: 'New York Liberty vs Phoenix Mercury - Over 162.5',
      explanation: 'Both teams play at fast pace and Mercury struggles defensively on the road. Expect high-scoring affair.',
      confidence: 84,
      betType: 'Total',
      sport: 'WNBA',
      odds: '-108',
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      title: 'LAFC vs LA Galaxy - Both Teams to Score',
      explanation: 'El Trafico always delivers goals. Both teams have potent attacks and leaky defenses in recent matchups.',
      confidence: 77,
      betType: 'Props',
      sport: 'MLS',
      odds: '-130',
      createdAt: new Date().toISOString(),
      isPremium: false
    }
  ];

  const sports = ['all', 'WNBA', 'MLB', 'UFC', 'MLS'];
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
          <TabsList className="grid w-full grid-cols-5">
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
