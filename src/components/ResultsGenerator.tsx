
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dices, TrendingUp, Users, Target } from 'lucide-react';
import { useBetResolution } from '@/hooks/useBetResolution';
import { useBets } from '@/hooks/useBets';

export const ResultsGenerator: React.FC = () => {
  const { generateMockResults, loading } = useBetResolution();
  const { bets, loading: betsLoading } = useBets();

  const openBets = bets.filter(bet => bet.status === 'open');
  const completedBets = bets.filter(bet => bet.status === 'completed');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dices className="h-5 w-5" />
          Bet Results Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">Open Bets</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{openBets.length}</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700">Completed</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{completedBets.length}</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700">Total Bets</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{bets.length}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Generate Mock Results</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will automatically resolve up to 5 open bets with random outcomes for demonstration purposes.
              Winners will receive payouts and escrow funds will be released.
            </p>
            
            <Button 
              onClick={generateMockResults} 
              disabled={loading || betsLoading || openBets.length === 0}
              className="w-full"
            >
              <Dices className="h-4 w-4 mr-2" />
              {loading ? 'Generating Results...' : `Generate Results for ${openBets.length} Open Bets`}
            </Button>
          </div>

          {openBets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No open bets available to generate results for.</p>
              <p className="text-sm">Create some bets first using the betting interface.</p>
            </div>
          )}

          {openBets.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Recent Open Bets:</h4>
              {openBets.slice(0, 3).map((bet) => (
                <div key={bet.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div>
                    <p className="text-sm font-medium">{bet.bet_selection}</p>
                    <p className="text-xs text-muted-foreground">
                      ${bet.amount?.toFixed(2)} | {bet.odds}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {bet.status}
                  </Badge>
                </div>
              ))}
              {openBets.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{openBets.length - 3} more open bets
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
