
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
  const [acceptAll, setAcceptAll] = useState(false);
  const { logConsent } = useCompliance();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!acceptAll) return;

    try {
      // Log all required consents as accepted
      await logConsent('terms', true, '1.0');
      await logConsent('privacy', true, '1.0');
      await logConsent('gdpr', true, '1.0');

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

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms & Privacy Agreement</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">By using EdgeStake.ai, you agree to:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Our Terms of Service and Privacy Policy</li>
                <li>• GDPR data processing for account management and betting services</li>
                <li>• Collection of account info, IP address, betting activity, and device information</li>
                <li>• KYC verification when required for compliance</li>
              </ul>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="accept-all"
                checked={acceptAll}
                onCheckedChange={(checked) => setAcceptAll(checked as boolean)}
              />
              <div className="flex-1">
                <label htmlFor="accept-all" className="text-sm font-medium cursor-pointer">
                  I accept all terms, privacy policy, and data processing requirements <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Required to access your EdgeStake.ai account and betting services.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500">*</span> Required for account access
          </p>
          <Button 
            onClick={handleSubmit} 
            disabled={!acceptAll}
            className="bg-primary hover:bg-primary/90"
          >
            Accept & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentModal;
