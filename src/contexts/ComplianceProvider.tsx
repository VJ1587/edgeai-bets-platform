
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

  useEffect(() => {
    if (user && !loading) {
      // Check if user needs to give consent
      const hasTerms = hasValidConsent('terms');
      const hasPrivacy = hasValidConsent('privacy');
      const hasGdpr = hasValidConsent('gdpr');
      
      const needsConsentCheck = !hasTerms || !hasPrivacy || !hasGdpr;
      setNeedsConsent(needsConsentCheck);
      
      if (needsConsentCheck) {
        setShowConsent(true);
      }

      // Log login event
      if (!needsConsentCheck) {
        logUserEvent('login', { timestamp: new Date().toISOString() });
      }
    }
  }, [user, loading, hasValidConsent, logUserEvent]);

  const handleConsentGiven = () => {
    setNeedsConsent(false);
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
        onClose={() => setShowConsent(false)}
        onConsentGiven={handleConsentGiven}
      />
    </ComplianceContext.Provider>
  );
};
