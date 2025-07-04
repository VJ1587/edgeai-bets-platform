
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useBookieOperator } from '@/hooks/useBookieOperator';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Settings,
  Plus,
  BarChart3,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookieDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { operator, lines, syndicates, transactions, loading, isBookieOperator } = useBookieOperator();

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isBookieOperator) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You need an active bookie operator license to access this dashboard.
            </p>
            <Button onClick={() => navigate('/bookie-licensing')}>
              Apply for License
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    totalLines: lines.length,
    activeSyndicates: syndicates.filter(s => s.status === 'open').length,
    totalVolume: transactions.reduce((sum, t) => sum + Number(t.gross_amount || 0), 0),
    revenue: transactions.reduce((sum, t) => sum + Number(t.net_amount || 0), 0)
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Bookie Dashboard</h1>
            <p className="text-muted-foreground">
              {operator?.business_name} • {operator?.tier.charAt(0).toUpperCase() + operator?.tier.slice(1)} Tier
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Lines</p>
                  <p className="text-2xl font-bold">{stats.totalLines}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Syndicates</p>
                  <p className="text-2xl font-bold">{stats.activeSyndicates}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold">${stats.totalVolume.toLocaleString()}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="lines" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="lines">Betting Lines</TabsTrigger>
            <TabsTrigger value="syndicates">Syndicates</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="lines">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Betting Lines</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Line
                </Button>
              </CardHeader>
              <CardContent>
                {lines.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No betting lines created yet.</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Line
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lines.map((line) => (
                      <div key={line.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{line.match_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {line.market_type} - {line.selection}
                            </p>
                            <p className="text-sm">Odds: {line.odds}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={line.is_active ? "default" : "secondary"}>
                              {line.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              Limit: ${line.stake_limit}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="syndicates">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Syndicates</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Syndicate
                </Button>
              </CardHeader>
              <CardContent>
                {syndicates.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No syndicates created yet.</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Syndicate
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {syndicates.map((syndicate) => (
                      <div key={syndicate.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{syndicate.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {syndicate.description}
                            </p>
                            <p className="text-sm">
                              ${syndicate.current_amount} / ${syndicate.target_amount}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={syndicate.status === 'open' ? "default" : "secondary"}>
                              {syndicate.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {syndicate.min_participants}-{syndicate.max_participants} participants
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No transactions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold capitalize">{transaction.transaction_type.replace('_', ' ')}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.processed_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${Number(transaction.gross_amount).toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              Net: ${Number(transaction.net_amount).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Business Name</p>
                      <p className="font-medium">{operator?.business_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">License Number</p>
                      <p className="font-medium">{operator?.license_number || 'Pending'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Verification Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>KYC Verification</span>
                      <Badge variant={operator?.kyc_verified ? "default" : "secondary"}>
                        {operator?.kyc_verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Bank Account</span>
                      <Badge variant={operator?.bank_account_verified ? "default" : "secondary"}>
                        {operator?.bank_account_verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Liquidity Validation</span>
                      <Badge variant={operator?.liquidity_validated ? "default" : "secondary"}>
                        {operator?.liquidity_validated ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookieDashboard;
