import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Plus, 
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { useBookieOperator } from '@/hooks/useBookieOperator';
import { Navigate } from 'react-router-dom';

const BookieDashboard = () => {
  const { 
    operator, 
    lines, 
    syndicates, 
    transactions, 
    loading, 
    isBookieOperator 
  } = useBookieOperator();

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!operator) {
    return <Navigate to="/bookie-licensing" replace />;
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending Review' },
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
      suspended: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, label: 'Suspended' },
      terminated: { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle, label: 'Terminated' }
    };
    const { color, icon: Icon, label } = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    
    return (
      <Badge className={`${color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getTierFeatures = (tier: string) => {
    const features = {
      starter: { maxParticipants: 10, features: 'Basic' },
      pro: { maxParticipants: 50, features: 'Advanced' },
      elite: { maxParticipants: 200, features: 'Premium' }
    };
    return features[tier as keyof typeof features] || features.starter;
  };

  const activeLines = lines.filter(line => line.is_active);
  const activeSyndicates = syndicates.filter(syndicate => syndicate.status === 'open');
  const totalVolume = transactions.reduce((sum, tx) => sum + (tx.gross_amount || 0), 0);
  const totalFees = transactions.reduce((sum, tx) => sum + (tx.platform_fee || 0) + (tx.escrow_fee || 0), 0);

  const tierInfo = getTierFeatures(operator.tier);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="px-4 pt-8 pb-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{operator.business_name}</h1>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(operator.status)}
                <Badge variant="secondary">
                  {operator.tier.charAt(0).toUpperCase() + operator.tier.slice(1)} Tier
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ${operator.monthly_fee}/month
                </span>
              </div>
            </div>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {operator.status === 'pending' && (
            <Alert className="mt-4">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your license application is under review. Complete KYC verification to speed up the process.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Lines</p>
                  <p className="text-2xl font-bold">{activeLines.length}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Syndicates</p>
                  <p className="text-2xl font-bold">{activeSyndicates.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Volume (30d)</p>
                  <p className="text-2xl font-bold">${totalVolume.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fees Earned</p>
                  <p className="text-2xl font-bold">${totalFees.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lines">Lines & Odds</TabsTrigger>
            <TabsTrigger value="syndicates">Syndicates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Tier Information */}
            <Card>
              <CardHeader>
                <CardTitle>License Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Current Tier: {operator.tier.charAt(0).toUpperCase() + operator.tier.slice(1)}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Max Participants: {tierInfo.maxParticipants} • Features: {tierInfo.features}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>KYC Verified:</span>
                        <span className={operator.kyc_verified ? 'text-green-600' : 'text-red-600'}>
                          {operator.kyc_verified ? 'Yes' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Liquidity Validated:</span>
                        <span className={operator.liquidity_validated ? 'text-green-600' : 'text-red-600'}>
                          {operator.liquidity_validated ? 'Yes' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Bank Verified:</span>
                        <span className={operator.bank_account_verified ? 'text-green-600' : 'text-red-600'}>
                          {operator.bank_account_verified ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">License Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>License Number:</span>
                        <span className="font-mono">{operator.license_number || 'Pending'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{new Date(operator.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Fee:</span>
                        <span className="font-semibold">${operator.monthly_fee}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No transactions yet</p>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{transaction.transaction_type.replace('_', ' ').toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.processed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${transaction.gross_amount}</p>
                          <p className="text-sm text-muted-foreground">
                            Fee: ${(transaction.platform_fee + transaction.escrow_fee).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lines" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Lines & Odds</CardTitle>
                <Button disabled={operator.status !== 'active'}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Line
                </Button>
              </CardHeader>
              <CardContent>
                {lines.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No lines created yet</p>
                    <Button className="mt-4" disabled={operator.status !== 'active'}>
                      Create Your First Line
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lines.map((line) => (
                      <div key={line.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{line.match_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {line.market_type} • {line.selection} @ {line.odds}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={line.is_active ? 'default' : 'secondary'}>
                              {line.is_active ? 'Active' : 'Inactive'}
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

          <TabsContent value="syndicates" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Syndicates</CardTitle>
                <Button disabled={operator.status !== 'active'}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Syndicate
                </Button>
              </CardHeader>
              <CardContent>
                {syndicates.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No syndicates created yet</p>
                    <Button className="mt-4" disabled={operator.status !== 'active'}>
                      Create Your First Syndicate
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {syndicates.map((syndicate) => (
                      <div key={syndicate.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{syndicate.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Target: ${syndicate.target_amount} • Current: ${syndicate.current_amount}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={syndicate.status === 'open' ? 'default' : 'secondary'}>
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

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Track your performance, manage risk, and optimize your lines
                  </p>
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