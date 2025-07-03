
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ComplianceProvider } from '@/contexts/ComplianceProvider';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard'; // New dashboard
import Picks from '@/pages/Picks';
import Lines from '@/pages/Lines';
import Challenges from '@/pages/Challenges';
import Plans from '@/pages/Plans';
import Profile from '@/pages/Profile';
import Success from '@/pages/Success';
import BookieDashboard from '@/pages/BookieDashboard';
import BookieLicensing from '@/pages/BookieLicensing';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ComplianceProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/landing" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/success" element={<Success />} />
                
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/picks" 
                  element={
                    <ProtectedRoute>
                      <Picks />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/lines" 
                  element={
                    <ProtectedRoute>
                      <Lines />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/challenges" 
                  element={
                    <ProtectedRoute>
                      <Challenges />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/plans" 
                  element={
                    <ProtectedRoute>
                      <Plans />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/bookie-dashboard" 
                  element={
                    <ProtectedRoute>
                      <BookieDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/bookie-licensing" 
                  element={
                    <ProtectedRoute>
                      <BookieLicensing />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </ComplianceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
