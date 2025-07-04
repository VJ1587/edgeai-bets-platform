
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ChallengeType } from '@/types/edgestake';

interface ChallengeTypeCardProps {
  challenge: ChallengeType;
  onSelect: (challenge: ChallengeType) => void;
  featured?: boolean;
}

export const ChallengeTypeCard: React.FC<ChallengeTypeCardProps> = ({
  challenge,
  onSelect,
  featured = false
}) => {
  return (
    <Card className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
      featured ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : ''
    }`}>
      <CardHeader className="text-center pb-4">
        <div className="text-4xl mb-2">{challenge.icon}</div>
        <CardTitle className="text-xl font-bold">{challenge.name}</CardTitle>
        {featured && (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            🔥 Featured
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          {challenge.description}
        </p>
        
        <div className="text-center space-y-2">
          <div className="text-xs text-muted-foreground">
            Stakes: ${challenge.minStake.toLocaleString()} - ${challenge.maxStake.toLocaleString()}
          </div>
        </div>
        
        <Button 
          onClick={() => onSelect(challenge)} 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Enter {challenge.name}
        </Button>
      </CardContent>
    </Card>
  );
};
