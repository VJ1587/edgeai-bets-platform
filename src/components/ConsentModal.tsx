
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCompliance } from '@/hooks/useCompliance';
import { useToast } from '@/hooks/use-toast';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsentGiven: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onClose, onConsentGiven }) => {
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    gdpr: false,
    marketing: false
  });
  const { logConsent } = useCompliance();
  const { toast } = useToast();

  const handleConsentChange = (type: keyof typeof consents, checked: boolean) => {
    setConsents(prev => ({ ...prev, [type]: checked }));
  };

  const handleSubmit = async () => {
    try {
      // Log all consents
      await logConsent('terms', consents.terms, '1.0');
      await logConsent('privacy', consents.privacy, '1.0');
      await logConsent('gdpr', consents.gdpr, '1.0');

      toast({
        title: "Consent Recorded",
        description: "Your preferences have been saved successfully.",
      });

      onConsentGiven();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record consent. Please try again.",
        variant: "destructive"
      });
    }
  };

  const canProceed = consents.terms && consents.privacy && consents.gdpr;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Privacy & Terms Consent</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={consents.terms}
                  onCheckedChange={(checked) => handleConsentChange('terms', checked as boolean)}
                />
                <div className="flex-1">
                  <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                    I agree to the Terms of Service <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    By checking this box, you agree to our terms and conditions for using EdgeStake.ai.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={consents.privacy}
                  onCheckedChange={(checked) => handleConsentChange('privacy', checked as boolean)}
                />
                <div className="flex-1">
                  <label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                    I agree to the Privacy Policy <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    We will collect and process your data as described in our privacy policy.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="gdpr"
                  checked={consents.gdpr}
                  onCheckedChange={(checked) => handleConsentChange('gdpr', checked as boolean)}
                />
                <div className="flex-1">
                  <label htmlFor="gdpr" className="text-sm font-medium cursor-pointer">
                    GDPR Data Processing Consent <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    I consent to the processing of my personal data for the purposes of account management, 
                    betting services, and compliance with legal obligations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketing"
                  checked={consents.marketing}
                  onCheckedChange={(checked) => handleConsentChange('marketing', checked as boolean)}
                />
                <div className="flex-1">
                  <label htmlFor="marketing" className="text-sm font-medium cursor-pointer">
                    Marketing Communications (Optional)
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Receive updates about new features, promotions, and betting insights.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Data We Collect:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Account information (email, name, date of birth)</li>
                <li>• IP address for security and compliance</li>
                <li>• Betting activity and transaction history</li>
                <li>• Device and browser information</li>
                <li>• KYC verification documents when required</li>
              </ul>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500">*</span> Required for account creation
          </p>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!canProceed}
              className="bg-primary hover:bg-primary/90"
            >
              Accept & Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentModal;
