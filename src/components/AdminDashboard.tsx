
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  activeBets: number;
  totalEscrow: number;
  activeSyndicates: number;
  totalUsers: number;
  pendingPayouts: number;
}

interface BetMatch {
  id: string;
  status: string;
  matched_amount: number;
  created_at: string;
  admin_notes?: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    activeBets: 0,
    totalEscrow: 0,
    activeSyndicates: 0,
    totalUsers: 0,
    pendingPayouts: 0
  });
  const [betMatches, setBetMatches] = useState<BetMatch[]>([]);
  const [selectedBet, setSelectedBet] = useState<BetMatch | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Fetch admin stats
      const [
        { count: betCount },
        { data: escrowData },
        { count: syndicateCount },
        { count: userCount },
        { data: betMatchData }
      ] = await Promise.all([
        supabase.from('bets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('bet_escrow').select('amount').eq('status', 'held'),
        supabase.from('group_challenges').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('bet_matches').select('*').order('created_at', { ascending: false }).limit(20)
      ]);

      const totalEscrow = escrowData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
      const pendingPayouts = betMatchData?.filter(b => b.status === 'active').length || 0;

      setStats({
        activeBets: betCount || 0,
        totalEscrow,
        activeSyndicates: syndicateCount || 0,
        totalUsers: userCount || 0,
        pendingPayouts
      });

      setBetMatches(betMatchData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveBet = async (betId: string, winnerId: string, method: string) => {
    try {
      const { error } = await supabase
        .from('bet_matches')
        .update({
          status: 'completed',
          winner_id: winnerId,
          resolved_at: new Date().toISOString(),
          resolution_method: method,
          admin_notes: resolutionNotes
        })
        .eq('id', betId);

      if (error) throw error;

      // Log admin activity
      await supabase
        .from('admin_activity_log')
        .insert({
          admin_id: user?.id,
          action_type: 'bet_resolution',
          target_id: betId,
          target_type: 'bet',
          description: `Manually resolved bet match with notes: ${resolutionNotes}`,
          new_values: { status: 'completed', winner_id: winnerId, resolution_method: method }
        });

      fetchAdminData();
      setSelectedBet(null);
      setResolutionNotes('');
    } catch (error) {
      console.error('Error resolving bet:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Bets</p>
                <p className="text-2xl font-bold">{stats.activeBets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Escrow</p>
                <p className="text-2xl font-bold">${stats.totalEscrow.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Syndicates</p>
                <p className="text-2xl font-bold">{stats.activeSyndicates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingPayouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bets">Bet Matches</TabsTrigger>
          <TabsTrigger value="escrow">Escrow Management</TabsTrigger>
          <TabsTrigger value="syndicates">Syndicate Activity</TabsTrigger>
          <TabsTrigger value="settings">Platform Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="bets">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bet Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {betMatches.map((bet) => (
                  <div key={bet.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Match #{bet.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        Amount: ${bet.matched_amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(bet.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={bet.status === 'active' ? 'default' : 'secondary'}>
                        {bet.status}
                      </Badge>
                      {bet.status === 'active' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedBet(bet)}>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Resolve Bet Match</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="font-medium">Match #{bet.id.slice(0, 8)}</p>
                                <p className="text-sm text-muted-foreground">
                                  Amount: ${bet.matched_amount.toFixed(2)}
                                </p>
                              </div>
                              
                              <Textarea
                                placeholder="Resolution notes (required)"
                                value={resolutionNotes}
                                onChange={(e) => setResolutionNotes(e.target.value)}
                                rows={3}
                              />

                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleResolveBet(bet.id, 'creator', 'manual_admin')}
                                  disabled={!resolutionNotes}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Resolve - Creator Wins
                                </Button>
                                <Button
                                  onClick={() => handleResolveBet(bet.id, 'opponent', 'manual_admin')}
                                  disabled={!resolutionNotes}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Resolve - Opponent Wins
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escrow">
          <Card>
            <CardHeader>
              <CardTitle>Escrow Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Total escrow held: ${stats.totalEscrow.toFixed(2)}
                  <br />
                  All escrow funds are secured and will be released upon bet resolution.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="syndicates">
          <Card>
            <CardHeader>
              <CardTitle>Syndicate Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {stats.activeSyndicates} active syndicate challenges available for participation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    Platform Fee: 2.5% | Escrow Fee: 1% (bets {'>'}$5,000)
                    <br />
                    Daily payout limit: $10,000 | Weekly limit: $50,000
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
