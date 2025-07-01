
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompliance } from '@/hooks/useCompliance';
import ConsentModal from '@/components/ConsentModal';

interface ComplianceContextType {
  needsConsent: boolean;
  hasValidConsent: (type: 'gdpr' | 'ccpa' | 'terms' | 'privacy') => boolean;
  logUserEvent: (eventType: string, eventData?: any) => Promise<void>;
  showConsentModal: () => void;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

export const useCompliantAuth = () => {
  const context = useContext(ComplianceContext);
  if (context === undefined) {
    throw new Error('useCompliantAuth must be used within a ComplianceProvider');
  }
  return context;
};

export const ComplianceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { hasValidConsent, logUserEvent, loading } = useCompliance();
  const [showConsent, setShowConsent] = useState(false);
  const [needsConsent, setNeedsConsent] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    if (user && !loading && !consentChecked) {
      // Check if user needs to give consent
      const hasTerms = hasValidConsent('terms');
      const hasPrivacy = hasValidConsent('privacy');
      const hasGdpr = hasValidConsent('gdpr');
      
      const needsConsentCheck = !hasTerms || !hasPrivacy || !hasGdpr;
      setNeedsConsent(needsConsentCheck);
      setConsentChecked(true);
      
      if (needsConsentCheck) {
        setShowConsent(true);
      } else {
        // Log login event for users who already have consent
        logUserEvent('login', { timestamp: new Date().toISOString() });
      }
    }
  }, [user, loading, hasValidConsent, logUserEvent, consentChecked]);

  const handleConsentGiven = () => {
    setNeedsConsent(false);
    setShowConsent(false);
    // Log login event after consent is given
    logUserEvent('login', { timestamp: new Date().toISOString() });
  };

  const showConsentModal = () => {
    setShowConsent(true);
  };

  const value = {
    needsConsent,
    hasValidConsent,
    logUserEvent,
    showConsentModal
  };

  return (
    <ComplianceContext.Provider value={value}>
      {children}
      <ConsentModal
        isOpen={showConsent}
        onClose={() => {}} // Prevent manual closing
        onConsentGiven={handleConsentGiven}
      />
    </ComplianceContext.Provider>
  );
};
