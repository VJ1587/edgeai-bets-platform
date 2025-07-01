
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCompliantAuth } from '@/contexts/ComplianceProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { needsConsent } = useCompliantAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  // Block access if user hasn't given required consent
  if (needsConsent) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <h2 className="text-xl font-bold mb-4">Consent Required</h2>
          <p className="text-muted-foreground mb-4">
            Please complete the consent process to access your account.
          </p>
          <div className="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
