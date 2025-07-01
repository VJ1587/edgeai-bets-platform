
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid3x3, Calendar, DollarSign } from 'lucide-react';

interface SquareCardProps {
  square: {
    id: string;
    gameTitle: string;
    pricePerSquare: number;
    soldSquares: number;
    totalSquares: number;
    gameDate: string;
  };
}

export const SquareCard: React.FC<SquareCardProps> = ({ square }) => {
  const availableSquares = square.totalSquares - square.soldSquares;
  const totalPot = square.soldSquares * square.pricePerSquare;

  const formatGameDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            <Grid3x3 className="h-3 w-3 mr-1" />
            Squares
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatGameDate(square.gameDate)}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">{square.gameTitle}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Available Squares</p>
              <p className="font-medium">{availableSquares}/{square.totalSquares}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Price per Square</p>
              <p className="font-medium">${square.pricePerSquare}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium">Total Prize Pool</span>
          </div>
          <span className="font-bold text-green-400">${totalPot}</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            View Grid
          </Button>
          <Button size="sm" className="flex-1" disabled={availableSquares === 0}>
            {availableSquares === 0 ? 'Sold Out' : 'Buy Squares'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
