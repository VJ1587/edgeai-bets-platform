
import React, { useState } from 'react';
import { BookieHub as BookieHubComponent } from '@/components/enhanced/BookieHub';
import { useAuth } from '@/contexts/AuthContext';
import { useBookieOperator } from '@/hooks/useBookieOperator';

const BookieHub = () => {
  const { user } = useAuth();
  const { operator, isBookieOperator } = useBookieOperator();
  
  const handleTierSelect = (tierId: string) => {
    console.log('Selected tier:', tierId);
    // Implementation for tier selection
  };

  const handleCreateLine = () => {
    console.log('Create line clicked');
    // Implementation for line creation
  };

  const handleManageEscrow = () => {
    console.log('Manage escrow clicked');
    // Implementation for escrow management
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <BookieHubComponent
          operator={operator}
          onTierSelect={handleTierSelect}
          onCreateLine={handleCreateLine}
          onManageEscrow={handleManageEscrow}
        />
      </div>
    </div>
  );
};

export default BookieHub;
