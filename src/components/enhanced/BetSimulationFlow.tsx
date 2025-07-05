
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Users, 
  Gamepad2, 
  TrendingUp, 
  Shield, 
  Clock,
  CheckCircle
} from 'lucide-react';
import type { BetSimulationFlow } from '@/types/edgestake';

interface BetSimulationFlowProps {
  flow: BetSimulationFlow;
  currentStep: number;
  onStepComplete: (stepId: string) => void;
}

export const BetSimulationFlow: React.FC<BetSimulationFlowProps> = ({
  flow,
  currentStep,
  onStepComplete
}) => {
  const getFlowIcon = (type: string) => {
    switch (type) {
      case 'throne_duel': return <Crown className="h-6 w-6 text-yellow-500" />;
      case 'arena_syndicate': return <Users className="h-6 w-6 text-blue-500" />;
      case 'kingmaker': return <Shield className="h-6 w-6 text-purple-500" />;
      case 'gamer_match': return <Gamepad2 className="h-6 w-6 text-green-500" />;
      default: return <TrendingUp className="h-6 w-6 text-orange-500" />;
    }
  };

  const getFlowTitle = (type: string) => {
    switch (type) {
      case 'throne_duel': return 'Throne Duel (1v1 Head-to-Head)';
      case 'arena_syndicate': return 'Arena Syndicate (Group Match)';
      case 'kingmaker': return 'Kingmaker (Elite Challenge)';
      case 'gamer_match': return 'Gamer Match (Console/PC)';
      default: return 'The Pit (Open Market)';
    }
  };

  const progress = ((currentStep + 1) / flow.steps.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getFlowIcon(flow.type)}
          <div className="flex-1">
            <CardTitle className="text-lg">{getFlowTitle(flow.type)}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={progress} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground">
                {currentStep + 1}/{flow.steps.length}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {flow.steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              index === currentStep
                ? 'border-primary bg-primary/5'
                : index < currentStep
                ? 'border-green-200 bg-green-50'
                : 'border-muted bg-muted/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : index === currentStep ? (
                  <Clock className="h-5 w-5 text-primary animate-pulse" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                )}
                <div>
                  <h4 className="font-medium">{step.name}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {step.duration && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      ~{step.duration}
                    </Badge>
                  )}
                </div>
              </div>
              
              {index === currentStep && !step.automated && (
                <Button
                  size="sm"
                  onClick={() => onStepComplete(step.id)}
                  className="ml-4"
                >
                  Complete
                </Button>
              )}
              
              {step.automated && (
                <Badge variant="secondary" className="ml-4">
                  Auto
                </Badge>
              )}
            </div>
          </div>
        ))}
        
        {/* Fee Structure */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium mb-3">Fee Structure</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span>Platform Fee:</span>
              <span className="font-medium">{flow.fees.platformFee}%</span>
            </div>
            {flow.fees.escrowFee && (
              <div className="flex justify-between">
                <span>Escrow Fee:</span>
                <span className="font-medium">{flow.fees.escrowFee}% (>$5K)</span>
              </div>
            )}
            {flow.fees.syndicateFee && (
              <div className="flex justify-between">
                <span>Syndicate Fee:</span>
                <span className="font-medium">{flow.fees.syndicateFee}%</span>
              </div>
            )}
            <div className="flex justify-between col-span-2 pt-2 border-t">
              <span>Max Daily Payout:</span>
              <span className="font-medium">${flow.fees.maxDailyPayout.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
