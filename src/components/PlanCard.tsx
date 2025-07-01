
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap } from 'lucide-react';

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    picksPerDay: number;
    features: string[];
    popular?: boolean;
    current?: boolean;
  };
  onSelect: (planId: string) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  const icons = {
    Free: Star,
    Pro: Zap,
    Elite: Star
  };
  
  const Icon = icons[plan.name as keyof typeof icons] || Star;

  return (
    <Card className={`relative card-hover ${plan.popular ? 'ring-2 ring-primary glow-yellow' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">${plan.price}</span>
          {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
        </div>
        <p className="text-lg font-semibold text-primary">
          {plan.picksPerDay} pick{plan.picksPerDay !== 1 ? 's' : ''} per day
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button
          onClick={() => onSelect(plan.id)}
          disabled={plan.current}
          className={`w-full ${plan.current ? '' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
          size="lg"
        >
          {plan.current ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
        </Button>
      </CardContent>
    </Card>
  );
};
