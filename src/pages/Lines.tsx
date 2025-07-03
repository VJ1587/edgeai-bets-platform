
import React, { useState, useEffect, useCallback } from 'react';
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
  const [isRealData, setIsRealData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOdds = useCallback(async () => {
    try {
      console.log('🔄 Loading odds...');
      setError(null);
      
      const data = await fetchLiveOdds();
      console.log(`📊 Received ${data.length} games`);
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      setOdds(data);
      setLastUpdated(new Date());
      
      // Check if we got real data (real data won't have 'mock-' prefix in IDs)
      const isReal = data.length > 0 && !data[0].id.startsWith('mock-');
      setIsRealData(isReal);
      
      console.log(`✅ Successfully loaded ${data.length} games (${isReal ? 'REAL' : 'MOCK'} data)`);
      
    } catch (error) {
      console.error('❌ Error loading odds:', error);
      setError(error instanceof Error ? error.message : 'Failed to load odds');
      setIsRealData(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const initialLoad = async () => {
      console.log('🚀 Initial load starting...');
      setLoading(true);
      await loadOdds();
      setLoading(false);
      console.log('🏁 Initial load completed');
    };
    initialLoad();
  }, [loadOdds]);

  // Real-time updates - poll every 30 seconds
  useEffect(() => {
    console.log('⏰ Setting up auto-refresh interval...');
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh triggered');
      loadOdds();
    }, 30000); // 30 seconds

    return () => {
      console.log('🛑 Clearing auto-refresh interval');
      clearInterval(interval);
    };
  }, [loadOdds]);

  const handleRefresh = async () => {
    console.log('👆 Manual refresh button clicked');
    setRefreshing(true);
    await loadOdds();
    setRefreshing(false);
    console.log('✅ Manual refresh completed');
  };

  const handleBetClick = (game: OddsData, market: string, outcome: any) => {
    console.log('🎲 Bet clicked:', { game: game.id, market, outcome });
    // This will be connected to betting logic in Phase 3
  };

  const sports = ['all', ...Array.from(new Set(odds.map(game => game.sport_title)))];
  
  const filteredOdds = selectedSport === 'all' 
    ? odds 
    : odds.filter(game => game.sport_title === selectedSport);

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return lastUpdated.toLocaleTimeString();
  };

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
            <p className="text-muted-foreground">
              {isRealData ? 'Real-time betting odds' : 'Demo odds data'}
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {formatLastUpdated()}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-400 mt-1">
                Error: {error}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Sports Filter */}
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
            <span className="text-sm font-medium text-green-400">
              {isRealData ? 'Live Odds - Auto-updating every 30s' : 'Demo Mode'}
            </span>
            {!isRealData && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                Mock Data
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              {filteredOdds.length} Games
            </Badge>
            {refreshing && (
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                Updating...
              </Badge>
            )}
          </div>
        </div>

        {/* Odds List */}
        <div className="space-y-4">
          {filteredOdds.map((game) => (
            <OddsCard
              key={`${game.id}-${lastUpdated?.getTime()}`}
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
            {isRealData ? ' Lines update automatically every 30 seconds.' : ' Currently showing demo data.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lines;
