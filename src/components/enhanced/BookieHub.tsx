
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  TrendingUp, 
  Shield, 
  Settings,
  BarChart3,
  Users,
  DollarSign
} from 'lucide-react';
import { bookieTiers } from '@/data/bookieTiers';
import type { BookieOperator } from '@/types/edgestake';

interface BookieHubProps {
  operator?: BookieOperator;
  onTierSelect: (tierId: string) => void;
  onCreateLine: () => void;
  onManageEscrow: () => void;
}

export const BookieHub: React.FC<BookieHubProps> = ({
  operator,
  onTierSelect,
  onCreateLine,
  onManageEscrow
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('');

  const handleTierSelection = (tierId: string) => {
    setSelectedTier(tierId);
    onTierSelect(tierId);
  };

  // Mock data for demo
  const dailyStats = {
    wagersToday: 12500,
    dailyCap: operator?.dailyCap || 25000,
    activeLines: 23,
    totalUsers: 156
  };

  const utilizationPercent = (dailyStats.wagersToday / dailyStats.dailyCap) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Bookie Hub
          </h1>
          <Crown className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-lg text-muted-foreground">Host & Manage Bets: White-Label Operations</p>
      </div>

      {!operator ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Choose Your Bookie Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookieTiers.map((tier) => (
                <Card 
                  key={tier.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTier === tier.id ? 'ring-2 ring-primary' : ''
                  } ${tier.id === 'institutional' ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50' : ''}`}
                  onClick={() => handleTierSelection(tier.id)}
                >
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2">{tier.badge}</div>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="text-2xl font-bold text-green-600">
                      {tier.monthlyFee === 0 ? 'Custom' : `$${tier.monthlyFee.toLocaleString()}/mo`}
                    </div>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Daily Cap:</span>
                        <span className="font-medium">
                          {tier.dailyCap === -1 ? 'Unlimited' : `$${tier.dailyCap.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {tier.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-4"
                      variant={selectedTier === tier.id ? 'default' : 'outline'}
                    >
                      {tier.id === 'institutional' ? 'Contact Sales' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="lines">Lines</TabsTrigger>
            <TabsTrigger value="escrow">Escrow</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    ${dailyStats.wagersToday.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Today's Volume</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{dailyStats.activeLines}</p>
                  <p className="text-sm text-muted-foreground">Active Lines</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{dailyStats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">
                    {utilizationPercent.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Daily Cap Usage</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Daily Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Volume: ${dailyStats.wagersToday.toLocaleString()}</span>
                    <span>Cap: ${dailyStats.dailyCap.toLocaleString()}</span>
                  </div>
                  <Progress value={utilizationPercent} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    ${(dailyStats.dailyCap - dailyStats.wagersToday).toLocaleString()} remaining today
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lines">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Lines</CardTitle>
                <Button onClick={onCreateLine}>Create New Line</Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Your betting lines will appear here. Create your first line to get started!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="escrow">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Escrow Management</CardTitle>
                <Button onClick={onManageEscrow} variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Escrow pools and risk management tools
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Detailed analytics and reporting tools
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
