
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Clock, DollarSign } from 'lucide-react';

interface GroupBetCardProps {
  groupBet: {
    id: string;
    title: string;
    description: string;
    currentAmount: number;
    targetAmount: number;
    participants: number;
    maxParticipants: number;
    closesIn: string;
  };
}

export const GroupBetCard: React.FC<GroupBetCardProps> = ({ groupBet }) => {
  const progressPercentage = (groupBet.currentAmount / groupBet.targetAmount) * 100;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-green-400 border-green-400">
            Active
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {groupBet.closesIn}
          </div>
        </div>

        <div className="mb-3">
          <h3 className="font-semibold mb-1">{groupBet.title}</h3>
          <p className="text-sm text-muted-foreground">{groupBet.description}</p>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>${groupBet.currentAmount} raised</span>
            <span>${groupBet.targetAmount} goal</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {groupBet.participants}/{groupBet.maxParticipants} joined
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              ${Math.round(groupBet.currentAmount / groupBet.participants)} avg
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            View Details
          </Button>
          <Button size="sm" className="flex-1">
            Join Pool
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
