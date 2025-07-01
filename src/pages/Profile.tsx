
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings, CreditCard, LogOut, Star, TrendingUp } from 'lucide-react';

const Profile = () => {
  // Mock user data
  const user = {
    email: 'user@example.com',
    plan: 'Free',
    joinDate: '2024-01-15',
    totalWins: 42,
    totalLosses: 18,
    winRate: 70,
    totalProfit: 1247
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="px-4 pt-8 pb-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{user.email}</h1>
          <Badge variant="secondary" className="mt-2">
            {user.plan} Plan
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-xl font-bold text-green-400">{user.winRate}%</p>
              <p className="text-xs text-muted-foreground">Win Rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xl font-bold text-primary">+${user.totalProfit}</p>
              <p className="text-xs text-muted-foreground">Total Profit</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Betting History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Bets</span>
              <span className="font-semibold">{user.totalWins + user.totalLosses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Wins</span>
              <span className="font-semibold text-green-400">{user.totalWins}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Losses</span>
              <span className="font-semibold text-red-400">{user.totalLosses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Member Since</span>
              <span className="font-semibold">{new Date(user.joinDate).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Settings className="h-5 w-5 mr-3" />
            Account Settings
          </Button>
          
          <Button variant="outline" className="w-full justify-start" size="lg">
            <CreditCard className="h-5 w-5 mr-3" />
            Billing & Plans
          </Button>
          
          <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-300" size="lg">
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>

        {/* Upgrade CTA */}
        {user.plan === 'Free' && (
          <Card className="mt-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Ready to level up?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get more picks and advanced features with Pro
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
