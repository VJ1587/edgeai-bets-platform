
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const { userProfile } = useAuth();

  useEffect(() => {
    // Refresh user profile to get updated plan
    const refreshProfile = async () => {
      if (userProfile?.id) {
        try {
          await supabase.functions.invoke('check-subscription');
        } catch (error) {
          console.log('Error refreshing subscription:', error);
        }
      }
    };

    refreshProfile();
  }, [userProfile?.id]);

  const planNames = {
    pro: 'Pro',
    elite: 'Elite'
  };

  const planFeatures = {
    pro: ['5 AI picks per day', 'Advanced analytics', 'Priority support'],
    elite: ['15 AI picks per day', 'VIP features', '1v1 Challenges', 'Group betting']
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Welcome to EdgeStake {planNames[plan as keyof typeof planNames]}!</h1>
          <p className="text-muted-foreground mb-6">
            Your subscription is now active. You now have access to:
          </p>
          
          <div className="space-y-2 mb-8">
            {plan && planFeatures[plan as keyof typeof planFeatures]?.map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              Start Getting Picks
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/profile')}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Manage Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
