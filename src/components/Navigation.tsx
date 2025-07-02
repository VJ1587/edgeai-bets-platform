
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, TrendingUp, User, CreditCard, BarChart3, Trophy, Building } from 'lucide-react';
import { useBookieOperator } from '@/hooks/useBookieOperator';

export const Navigation = () => {
  const { operator, isBookieOperator } = useBookieOperator();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/picks', icon: TrendingUp, label: 'Picks' },
    { to: '/lines', icon: BarChart3, label: 'Lines' },
    { to: '/challenges', icon: Trophy, label: 'Challenges' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  // Add bookie navigation based on status
  if (operator) {
    if (isBookieOperator) {
      navItems.splice(4, 0, { to: '/bookie-dashboard', icon: Building, label: 'Bookie' });
    } else {
      navItems.splice(4, 0, { to: '/bookie-licensing', icon: Building, label: 'Bookie' });
    }
  } else {
    navItems.splice(4, 0, { to: '/bookie-licensing', icon: Building, label: 'Bookie' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
