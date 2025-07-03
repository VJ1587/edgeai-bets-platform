
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ComplianceProvider } from '@/contexts/ComplianceProvider';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
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
                <Route path="*" element={<NotFound />} />
                
                {/* All protected routes now use Layout which includes dashboard sections */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Home />} />
                  <Route path="home" element={<Home />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="picks" element={<Picks />} />
                  <Route path="lines" element={<Lines />} />
                  <Route path="challenges" element={<Challenges />} />
                  <Route path="plans" element={<Plans />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="bookie-dashboard" element={<BookieDashboard />} />
                  <Route path="bookie-licensing" element={<BookieLicensing />} />
                </Route>
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
