
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // For now, redirect to home. This will be updated when auth is integrated.
  return <Navigate to="/auth" replace />;
};

export default Index;
