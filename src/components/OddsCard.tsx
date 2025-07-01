
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp } from 'lucide-react';
import { OddsData } from '@/services/oddsService';

interface OddsCardProps {
  game: OddsData;
  onBetClick?: (game: OddsData, market: string, outcome: any) => void;
}

export const OddsCard: React.FC<OddsCardProps> = ({ game, onBetClick }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatOdds = (price: number) => {
    return price > 0 ? `+${price}` : `${price}`;
  };

  const getMainBookmaker = () => {
    return game.bookmakers[0]; // Use first bookmaker for display
  };

  const bookmaker = getMainBookmaker();
  const moneylineMarket = bookmaker?.markets.find(m => m.key === 'h2h');
  const spreadMarket = bookmaker?.markets.find(m => m.key === 'spreads');
  const totalMarket = bookmaker?.markets.find(m => m.key === 'totals');

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-xs">
            {game.sport_title}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatTime(game.commence_time)}
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm font-medium">{game.away_team}</p>
          <p className="text-xs text-muted-foreground">@</p>
          <p className="text-sm font-medium">{game.home_team}</p>
        </div>

        {/* Moneyline */}
        {moneylineMarket && (
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Moneyline</p>
            <div className="grid grid-cols-2 gap-2">
              {moneylineMarket.outcomes.slice(0, 2).map((outcome, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs p-2 h-auto"
                  onClick={() => onBetClick?.(game, 'moneyline', outcome)}
                >
                  <div className="text-center">
                    <p className="truncate">{outcome.name.split(' ').pop()}</p>
                    <p className="font-bold">{formatOdds(outcome.price)}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Spread */}
        {spreadMarket && (
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Spread</p>
            <div className="grid grid-cols-2 gap-2">
              {spreadMarket.outcomes.map((outcome, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs p-2 h-auto"
                  onClick={() => onBetClick?.(game, 'spread', outcome)}
                >
                  <div className="text-center">
                    <p className="truncate">{outcome.name.split(' ').pop()}</p>
                    <p className="font-bold">
                      {outcome.point! > 0 ? '+' : ''}{outcome.point} ({formatOdds(outcome.price)})
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        {totalMarket && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Total</p>
            <div className="grid grid-cols-2 gap-2">
              {totalMarket.outcomes.map((outcome, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs p-2 h-auto"
                  onClick={() => onBetClick?.(game, 'total', outcome)}
                >
                  <div className="text-center">
                    <p>{outcome.name}</p>
                    <p className="font-bold">
                      {outcome.point} ({formatOdds(outcome.price)})
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t">
          <p className="text-xs text-muted-foreground">{bookmaker?.title}</p>
          <div className="flex items-center gap-1 text-xs text-green-400">
            <TrendingUp className="h-3 w-3" />
            Live
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
