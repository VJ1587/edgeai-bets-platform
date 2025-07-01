
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Filter } from 'lucide-react';
import { OddsCard } from '@/components/OddsCard';
import { fetchLiveOdds, OddsData } from '@/services/oddsService';

const Lines = () => {
  const [odds, setOdds] = useState<OddsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOdds();
  }, []);

  const loadOdds = async () => {
    setLoading(true);
    try {
      const data = await fetchLiveOdds();
      setOdds(data);
    } catch (error) {
      console.error('Error loading odds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOdds();
    setRefreshing(false);
  };

  const handleBetClick = (game: OddsData, market: string, outcome: any) => {
    console.log('Bet clicked:', { game: game.id, market, outcome });
    // This will be connected to betting logic in Phase 3
  };

  const sports = ['all', ...Array.from(new Set(odds.map(game => game.sport_title)))];
  
  const filteredOdds = selectedSport === 'all' 
    ? odds 
    : odds.filter(game => game.sport_title === selectedSport);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading live odds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="px-4 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Live Lines</h1>
            <p className="text-muted-foreground">Real-time betting odds</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Sports Filter - Show all sports in a scrollable horizontal tabs */}
        <Tabs value={selectedSport} onValueChange={setSelectedSport} className="mb-6">
          <TabsList className="w-full overflow-x-auto flex justify-start">
            {sports.map((sport) => (
              <TabsTrigger 
                key={sport} 
                value={sport} 
                className="text-xs whitespace-nowrap px-4"
              >
                {sport === 'all' ? 'All Sports' : sport}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Live Indicator */}
        <div className="flex items-center justify-between mb-6 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-400">Live Odds</span>
          </div>
          <Badge variant="outline" className="text-green-400 border-green-400">
            {filteredOdds.length} Games
          </Badge>
        </div>

        {/* Odds List */}
        <div className="space-y-4">
          {filteredOdds.map((game) => (
            <OddsCard
              key={game.id}
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

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-card/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Odds are for entertainment purposes. Always gamble responsibly.
            Lines update every 30 seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lines;
