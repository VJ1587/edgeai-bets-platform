
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Star, Building } from 'lucide-react';

interface BookieTierCardProps {
  tier: 'starter' | 'pro' | 'elite' | 'institutional';
  monthlyFee: number;
  dailyCap: string;
  features: string[];
  isActive?: boolean;
  onSelect: () => void;
}

const tierConfig = {
  starter: {
    icon: Star,
    color: 'bg-blue-500',
    name: 'Local Bookie',
    description: 'Perfect for getting started'
  },
  pro: {
    icon: Shield,
    color: 'bg-purple-500',
    name: 'Regional Host',
    description: 'Enhanced features and higher limits'
  },
  elite: {
    icon: Crown,
    color: 'bg-yellow-500',
    name: 'Elite Operator',
    description: 'Premium tier with advanced tools'
  },
  institutional: {
    icon: Building,
    color: 'bg-red-500',
    name: 'Institutional Desk',
    description: 'Custom enterprise solution'
  }
};

export const BookieTierCard: React.FC<BookieTierCardProps> = ({
  tier,
  monthlyFee,
  dailyCap,
  features,
  isActive,
  onSelect
}) => {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Card className={`relative transition-all hover:shadow-lg ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="text-center pb-4">
        <div className={`w-16 h-16 ${config.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold">{config.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{config.description}</p>
        {isActive && (
          <Badge variant="default" className="absolute top-4 right-4">
            Active
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold">
            ${monthlyFee}
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          </div>
          <p className="text-sm text-muted-foreground">Daily Cap: {dailyCap}</p>
        </div>
        
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              {feature}
            </div>
          ))}
        </div>
        
        <Button 
          onClick={onSelect} 
          className="w-full"
          variant={isActive ? "outline" : "default"}
        >
          {isActive ? 'Current Plan' : 'Select Plan'}
        </Button>
      </CardContent>
    </Card>
  );
};
