
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Clock } from 'lucide-react';

interface PickCardProps {
  pick: {
    id: string;
    title: string;
    explanation: string;
    confidence: number;
    betType: string;
    sport: string;
    odds: string;
    createdAt: string;
    isPremium?: boolean;
  };
  isLocked?: boolean;
}

export const PickCard: React.FC<PickCardProps> = ({ pick, isLocked = false }) => {
  const confidenceColor = pick.confidence >= 80 ? 'text-green-400' : 
                         pick.confidence >= 60 ? 'text-yellow-400' : 'text-orange-400';

  return (
    <Card className={`card-hover ${isLocked ? 'opacity-60 relative overflow-hidden' : ''}`}>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Premium Pick</p>
            <p className="text-xs text-muted-foreground">Upgrade to unlock</p>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{pick.title}</CardTitle>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {pick.sport}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{new Date(pick.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className={confidenceColor}>{pick.confidence}%</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-primary mb-1">
              {pick.betType} • {pick.odds}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isLocked ? pick.explanation.substring(0, 50) + '...' : pick.explanation}
            </p>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Confidence</span>
              <span className={`font-bold ${confidenceColor}`}>{pick.confidence}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-1">
              <div 
                className={`h-2 rounded-full ${
                  pick.confidence >= 80 ? 'bg-green-400' : 
                  pick.confidence >= 60 ? 'bg-yellow-400' : 'bg-orange-400'
                }`}
                style={{ width: `${pick.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
