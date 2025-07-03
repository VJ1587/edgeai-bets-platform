
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  TrendingUp, 
  BarChart3, 
  Users, 
  CreditCard,
  User,
  LogOut,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/landing');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Check if user is admin
  const isAdmin = user?.email === 'vimj1915@gmail.com' || user?.email?.includes('@edgestake.ai');

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: TrendingUp, label: 'Dashboard' },
    { path: '/picks', icon: BarChart3, label: 'Picks' },
    { path: '/lines', icon: TrendingUp, label: 'Lines' },
    { path: '/challenges', icon: Users, label: 'Challenges' },
    { path: '/plans', icon: CreditCard, label: 'Plans' },
  ];

  return (
    <nav className="bg-card border-b">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link to="/" className="text-lg sm:text-xl font-bold text-primary">
              EdgeStake<span className="text-blue-400">.ai</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                  {item.path === '/dashboard' && (
                    <Badge variant="secondary" className="text-xs">New</Badge>
                  )}
                </Link>
              ))}

              {isAdmin && (
                <Badge variant="destructive" className="text-xs">
                  <Shield size={12} className="mr-1" />
                  Admin
                </Badge>
              )}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
            {user && (
              <span className="text-xs sm:text-sm text-muted-foreground hidden md:block">
                {user.email}
              </span>
            )}
            
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <User size={16} />
              </Button>
            </Link>

            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut size={16} />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:hidden">
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <User size={16} />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t py-3">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.path === '/dashboard' && (
                    <Badge variant="secondary" className="text-xs ml-auto">New</Badge>
                  )}
                </Link>
              ))}
              
              {user && (
                <div className="px-3 py-2 text-xs text-muted-foreground border-t mt-2 pt-3">
                  {user.email}
                </div>
              )}
              
              {isAdmin && (
                <div className="px-3 py-2">
                  <Badge variant="destructive" className="text-xs">
                    <Shield size={12} className="mr-1" />
                    Admin
                  </Badge>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                className="justify-start px-3 py-3 text-sm"
                onClick={handleSignOut}
              >
                <LogOut size={16} className="mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
