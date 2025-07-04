
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookieTierCard } from '@/components/BookieTierCard';
import { useAuth } from '@/contexts/AuthContext';
import { useBookieOperator } from '@/hooks/useBookieOperator';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const BookieLicensing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { operator, loading, applyForLicense } = useBookieOperator();
  const [selectedTier, setSelectedTier] = useState<'starter' | 'pro' | 'elite'>('starter');
  const [businessName, setBusinessName] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const tiers = {
    starter: {
      monthlyFee: 249,
      dailyCap: '$5,000',
      features: [
        'Basic betting lines',
        'Up to $5K daily volume',
        'Standard support',
        'Basic analytics',
        'Mobile-optimized interface'
      ]
    },
    pro: {
      monthlyFee: 499,
      dailyCap: '$25,000',
      features: [
        'Advanced betting lines',
        'Up to $25K daily volume',
        'Limited line controls',
        'Enhanced analytics',
        'Priority support',
        'Risk management tools'
      ]
    },
    elite: {
      monthlyFee: 999,
      dailyCap: '$100,000',
      features: [
        'Full betting suite',
        'Up to $100K daily volume',
        'Complete line controls',
        'API feed integration',
        'Escrow pool management',
        'White-label options',
        'Dedicated account manager'
      ]
    }
  };

  const handleApply = async () => {
    if (!businessName.trim()) {
      toast.error('Please enter a business name');
      return;
    }

    setIsApplying(true);
    try {
      await applyForLicense({
        businessName: businessName.trim(),
        tier: selectedTier
      });
      toast.success('Application submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to submit application');
      console.error('Application error:', error);
    } finally {
      setIsApplying(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p>Please sign in to access bookie licensing.</p>
            <Button onClick={() => navigate('/auth')} className="mt-4">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (operator) {
    return (
      <div className="min-h-screen gradient-bg p-4">
        <div className="container mx-auto max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Bookie License Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Business Name</Label>
                  <p className="font-medium">{operator.business_name}</p>
                </div>
                <div>
                  <Label>Tier</Label>
                  <p className="font-medium capitalize">{operator.tier}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className={`font-medium capitalize ${
                    operator.status === 'active' ? 'text-green-600' : 
                    operator.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {operator.status}
                  </p>
                </div>
                <div>
                  <Label>Monthly Fee</Label>
                  <p className="font-medium">${operator.monthly_fee}</p>
                </div>
              </div>
              
              {operator.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    Your application is being reviewed. You'll be notified once approved.
                  </p>
                </div>
              )}
              
              {operator.status === 'active' && (
                <Button onClick={() => navigate('/bookie-dashboard')} className="w-full">
                  Access Bookie Dashboard
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="container mx-auto max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Become a Bookie Operator</h1>
          <p className="text-xl text-muted-foreground">
            Join EdgeStake's network of licensed betting operators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(tiers).map(([tier, config]) => (
            <BookieTierCard
              key={tier}
              tier={tier as 'starter' | 'pro' | 'elite'}
              monthlyFee={config.monthlyFee}
              dailyCap={config.dailyCap}
              features={config.features}
              isActive={selectedTier === tier}
              onSelect={() => setSelectedTier(tier as 'starter' | 'pro' | 'elite')}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Selected Plan: {tiers[selectedTier].monthlyFee === 249 ? 'Local Bookie' : tiers[selectedTier].monthlyFee === 499 ? 'Regional Host' : 'Elite Operator'}</h3>
              <p className="text-blue-800">
                Monthly Fee: ${tiers[selectedTier].monthlyFee} | Daily Cap: {tiers[selectedTier].dailyCap}
              </p>
            </div>
            
            <Button 
              onClick={handleApply} 
              disabled={isApplying || !businessName.trim()}
              className="w-full"
            >
              {isApplying ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookieLicensing;
