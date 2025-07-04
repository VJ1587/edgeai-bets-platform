
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp } from 'lucide-react';
import type { DemoEvent } from '@/types/edgestake';

interface DemoEventCardProps {
  event: DemoEvent;
  onBet: (event: DemoEvent) => void;
}

export const DemoEventCard: React.FC<DemoEventCardProps> = ({ event, onBet }) => {
  const categoryColors = {
    sports: 'bg-green-100 text-green-800',
    esports: 'bg-purple-100 text-purple-800',
    gaming: 'bg-blue-100 text-blue-800'
  };

  return (
    <Card className={`transition-all hover:shadow-lg ${
      event.featured ? 'ring-2 ring-yellow-400' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold leading-tight">
              {event.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={categoryColors[event.category]}>
                {event.category.toUpperCase()}
              </Badge>
              {event.featured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  ⭐ Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(event.date).toLocaleDateString()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            Live Odds
          </div>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(event.odds).slice(0, 3).map(([market, odds]) => (
              <div key={market} className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-sm">{market}</span>
                <Badge variant="outline" className="font-mono">
                  {odds.toFixed(2)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={() => onBet(event)} 
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          Place Bet
        </Button>
      </CardContent>
    </Card>
  );
};
