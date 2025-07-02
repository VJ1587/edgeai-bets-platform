import React, { useState } from 'react';
import { BookieTierCard } from '@/components/BookieTierCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, DollarSign, TrendingUp, Building, Info } from 'lucide-react';
import { useBookieOperator } from '@/hooks/useBookieOperator';
import { useToast } from '@/hooks/use-toast';

const BookieLicensing = () => {
  const { operator, loading, applyForLicense } = useBookieOperator();
  const { toast } = useToast();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'starter' | 'pro' | 'elite'>('starter');
  const [businessName, setBusinessName] = useState('');
  const [applying, setApplying] = useState(false);

  const tiers = [
    {
      id: 'starter' as const,
      name: 'Starter',
      price: 97,
      maxParticipants: 10,
      features: [
        'Custom lines and odds creation',
        'Up to 10 syndicated participants',
        'Basic analytics dashboard',
        'Email support',
        'Standard escrow protection',
        '2.5% platform fee',
        '1% escrow fee (>$5K bets)'
      ],
      current: operator?.tier === 'starter'
    },
    {
      id: 'pro' as const,
      name: 'Pro',
      price: 297,
      maxParticipants: 50,
      features: [
        'Everything in Starter',
        'Unlimited syndicated participants',
        'Private client dashboards',
        'Advanced risk analytics',
        'Priority support',
        'Custom branding options',
        'API access for integrations',
        'Enhanced liquidity tools'
      ],
      popular: true,
      current: operator?.tier === 'pro'
    },
    {
      id: 'elite' as const,
      name: 'Elite',
      price: 997,
      maxParticipants: 200,
      features: [
        'Everything in Pro',
        'Multi-agent team management',
        'White-label platform skin',
        'Dedicated account manager',
        'Custom credit line arrangements',
        'Real-time settlement tools',
        'Advanced fraud protection',
        'Institutional-grade compliance',
        '24/7 phone support'
      ],
      current: operator?.tier === 'elite'
    }
  ];

  const handleTierSelect = (tierId: string) => {
    if (operator) {
      toast({
        title: "Upgrade Required",
        description: "Contact support to upgrade your existing license tier.",
        variant: "default"
      });
      return;
    }
    
    setSelectedTier(tierId as 'starter' | 'pro' | 'elite');
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    setApplying(true);
    try {
      await applyForLicense({
        businessName: businessName.trim(),
        tier: selectedTier
      });

      toast({
        title: "Application Submitted",
        description: "Your bookie license application has been submitted for review. You'll receive an email confirmation shortly.",
        variant: "default"
      });

      setShowApplicationForm(false);
      setBusinessName('');
    } catch (error) {
      toast({
        title: "Application Failed",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="px-4 pt-8 pb-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">EdgeStake Bookie Licensing</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Become a licensed operator and create your own betting lines
          </p>
          
          {operator && (
            <Alert className="max-w-2xl mx-auto mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Current Status:</strong> {operator.status === 'pending' ? 'Application Pending Review' : 
                operator.status === 'active' ? `Active ${operator.tier} License` : 
                operator.status.charAt(0).toUpperCase() + operator.status.slice(1)}
                {operator.status === 'active' && (
                  <span className="ml-2 text-green-600 font-semibold">
                    • ${operator.monthly_fee}/month
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Platform Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-semibold">Secure Escrow</p>
              <p className="text-xs text-muted-foreground">Protected funds</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-semibold">Syndicate Pools</p>
              <p className="text-xs text-muted-foreground">Group betting</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm font-semibold">2.5% Platform Fee</p>
              <p className="text-xs text-muted-foreground">Competitive rates</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-sm font-semibold">Analytics</p>
              <p className="text-xs text-muted-foreground">Real-time data</p>
            </CardContent>
          </Card>
        </div>

        {/* Licensing Tiers */}
        <div className="space-y-6 mb-8">
          {tiers.map((tier) => (
            <BookieTierCard
              key={tier.id}
              tier={tier}
              onSelect={handleTierSelect}
              disabled={applying}
            />
          ))}
        </div>

        {/* Compliance Notice */}
        <Card className="max-w-4xl mx-auto bg-blue-50/50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Compliance & Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Required Verification</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• KYC identity verification</li>
                  <li>• Business registration documents</li>
                  <li>• Bank account or crypto escrow validation</li>
                  <li>• Liquidity proof ($10K minimum)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Platform Rules</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Equal-stake enforcement for all bets</li>
                  <li>• 24-48h hold for wins over $5K</li>
                  <li>• Automatic escrow for matched funds</li>
                  <li>• Real-time audit trails required</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Form Dialog */}
        <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} License</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  required
                  disabled={applying}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will appear on your bookie profile and lines
                </p>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  After submitting, you'll need to complete KYC verification and provide business documentation before your license is approved.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1"
                  disabled={applying}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={applying || !businessName.trim()}
                >
                  {applying ? 'Submitting...' : 'Apply Now'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BookieLicensing;