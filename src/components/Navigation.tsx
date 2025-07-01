
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, TrendingUp, User, CreditCard } from 'lucide-react';

export const Navigation = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/picks', icon: TrendingUp, label: 'Picks' },
    { to: '/plans', icon: CreditCard, label: 'Plans' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

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
