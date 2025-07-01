
import React from 'react';
import { PlanCard } from '@/components/PlanCard';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Users, Trophy } from 'lucide-react';

const Plans = () => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      picksPerDay: 1,
      features: [
        '1 AI pick per day',
        'Basic win rate stats',
        'Community access',
        'Email notifications'
      ],
      current: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      picksPerDay: 5,
      features: [
        '5 AI picks per day',
        'Advanced analytics',
        'Bet tracking tools',
        'Priority support',
        'Parlay combinations',
        'Historical data access'
      ],
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 97,
      picksPerDay: 15,
      features: [
        '15 AI picks per day',
        'Premium insider info',
        'Custom betting strategies',
        'Direct expert access',
        'VIP community',
        'Guaranteed ROI tracking',
        'Live pick notifications'
      ]
    }
  ];

  const handlePlanSelect = (planId: string) => {
    console.log('Selected plan:', planId);
    // Will integrate with Stripe checkout
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="px-4 pt-8 pb-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground">
            Unlock more AI picks and advanced features
          </p>
        </div>

        {/* Social Proof */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-lg font-bold">12K+</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-green-400" />
              <p className="text-lg font-bold">74%</p>
              <p className="text-xs text-muted-foreground">Win Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-lg font-bold">4.8</p>
              <p className="text-xs text-muted-foreground">App Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Plans */}
        <div className="space-y-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>

        {/* Guarantee */}
        <div className="mt-8 p-6 bg-card rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">30-Day Money Back Guarantee</h3>
          <p className="text-sm text-muted-foreground">
            Not satisfied? Get a full refund within 30 days, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Plans;
