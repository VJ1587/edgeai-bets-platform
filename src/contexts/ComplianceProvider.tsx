
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
  
  // DEMO MODE: Temporarily disable compliance requirements
  const [needsConsent, setNeedsConsent] = useState(false);
  const [consentChecked, setConsentChecked] = useState(true);

  useEffect(() => {
    if (user && !loading && !consentChecked) {
      // DEMO MODE: Skip consent checking for demo
      setNeedsConsent(false);
      setConsentChecked(true);
      
      // Log login event for demo
      logUserEvent('login', { timestamp: new Date().toISOString() });
    }
  }, [user, loading, logUserEvent, consentChecked]);

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
    needsConsent: false, // DEMO MODE: Always return false
    hasValidConsent: () => true, // DEMO MODE: Always return true
    logUserEvent,
    showConsentModal
  };

  return (
    <ComplianceContext.Provider value={value}>
      {children}
      {/* DEMO MODE: Hide consent modal */}
      {false && (
        <ConsentModal
          isOpen={showConsent}
          onClose={() => {}} // Prevent manual closing
          onConsentGiven={handleConsentGiven}
        />
      )}
    </ComplianceContext.Provider>
  );
};
