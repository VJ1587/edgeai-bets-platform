
import React, { useState } from 'react';
import { BetSimulationFlow } from '@/components/enhanced/BetSimulationFlow';
import type { BetSimulationFlow as BetFlow } from '@/types/edgestake';

const BetSimulation = () => {
  const [currentFlow, setCurrentFlow] = useState<BetFlow>({
    type: 'throne_duel',
    fees: {
      platformFee: 2.5,
      escrowFee: 1.0,
      maxDailyPayout: 100000
    },
    steps: [
      {
        id: '1',
        name: 'Set Terms & Stakes',
        description: 'User A defines bet terms and amount',
        automated: false,
        duration: '2-5 min'
      },
      {
        id: '2',
        name: 'Escrow Funds',
        description: 'Stakes automatically moved to escrow vault',
        automated: true,
        duration: '30 sec'
      },
      {
        id: '3',
        name: 'Find Opponent',
        description: 'User B accepts the challenge',
        automated: false,
        duration: '1-24 hours'
      },
      {
        id: '4',
        name: 'Match Countdown',
        description: 'Event countdown timer begins',
        automated: true,
        duration: '5 min'
      },
      {
        id: '5',
        name: 'Live Event',
        description: 'Outcome determined via live API',
        automated: true,
        duration: 'Event dependent'
      },
      {
        id: '6',
        name: 'Settlement',
        description: 'Winner receives total pot minus fees',
        automated: true,
        duration: '1-5 min'
      },
      {
        id: '7',
        name: 'Update Records',
        description: 'Match history and leaderboards updated',
        automated: true,
        duration: '30 sec'
      }
    ]
  });
  
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepComplete = (stepId: string) => {
    const stepIndex = currentFlow.steps.findIndex(s => s.id === stepId);
    if (stepIndex !== -1 && stepIndex === currentStep) {
      setCurrentStep(prev => Math.min(prev + 1, currentFlow.steps.length - 1));
    }
  };

  const flowTypes = [
    { id: 'throne_duel', name: 'Throne Duel (1v1)', emoji: '⚔️' },
    { id: 'arena_syndicate', name: 'Arena Syndicate', emoji: '🏟️' },
    { id: 'kingmaker', name: 'Kingmaker Elite', emoji: '👑' },
    { id: 'gamer_match', name: 'Gamer Match', emoji: '🎮' },
    { id: 'pit_challenge', name: 'The Pit', emoji: '🔥' }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Bet Simulation Flows</h1>
          <p className="text-muted-foreground">Experience how different bet types work</p>
        </div>

        {/* Flow Type Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {flowTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setCurrentFlow(prev => ({ ...prev, type: type.id as any }));
                setCurrentStep(0);
              }}
              className={`px-4 py-2 rounded-lg border transition-all ${
                currentFlow.type === type.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted hover:border-primary/50'
              }`}
            >
              {type.emoji} {type.name}
            </button>
          ))}
        </div>

        <BetSimulationFlow
          flow={currentFlow}
          currentStep={currentStep}
          onStepComplete={handleStepComplete}
        />
        
        {/* Reset Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => setCurrentStep(0)}
            className="px-6 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            Reset Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetSimulation;
