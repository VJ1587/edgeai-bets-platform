import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap } from 'lucide-react';

interface BookieTier {
  id: 'starter' | 'pro' | 'elite';
  name: string;
  price: number;
  maxParticipants: number;
  features: string[];
  popular?: boolean;
  current?: boolean;
}

interface BookieTierCardProps {
  tier: BookieTier;
  onSelect: (tierId: string) => void;
  disabled?: boolean;
}

export const BookieTierCard: React.FC<BookieTierCardProps> = ({ 
  tier, 
  onSelect, 
  disabled = false 
}) => {
  const icons = {
    starter: Star,
    pro: Zap,
    elite: Crown
  };
  
  const Icon = icons[tier.id];

  const tierColors = {
    starter: 'border-blue-200 bg-blue-50/50',
    pro: 'border-purple-200 bg-purple-50/50 ring-2 ring-primary',
    elite: 'border-yellow-200 bg-yellow-50/50'
  };

  return (
    <Card className={`relative card-hover transition-all duration-300 ${tierColors[tier.id]} ${
      tier.popular ? 'scale-105 shadow-xl' : 'hover:scale-102'
    }`}>
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-primary text-primary-foreground px-4 py-1.5 font-semibold">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-6 pt-8">
        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
          tier.id === 'starter' ? 'bg-blue-100 text-blue-600' :
          tier.id === 'pro' ? 'bg-purple-100 text-purple-600' :
          'bg-yellow-100 text-yellow-600'
        }`}>
          <Icon className="h-10 w-10" />
        </div>
        <CardTitle className="text-2xl font-bold">{tier.name} Bookie</CardTitle>
        <div className="mt-3">
          <span className="text-4xl font-bold text-primary">${tier.price}</span>
          <span className="text-muted-foreground text-lg">/month</span>
        </div>
        <p className="text-lg font-semibold text-muted-foreground">
          Up to {tier.maxParticipants} syndicated participants
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ul className="space-y-4">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button
          onClick={() => onSelect(tier.id)}
          disabled={disabled || tier.current}
          className={`w-full py-6 text-lg font-semibold ${
            tier.current 
              ? 'bg-muted text-muted-foreground' 
              : tier.id === 'pro'
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg'
                : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
          }`}
          size="lg"
        >
          {tier.current 
            ? 'Current Tier' 
            : tier.price === 0 
              ? 'Get Started' 
              : 'Apply Now'
          }
        </Button>
      </CardContent>
    </Card>
  );
};