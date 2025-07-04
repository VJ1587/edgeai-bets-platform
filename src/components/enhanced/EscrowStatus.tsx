
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import type { EscrowTransaction } from '@/types/edgestake';

interface EscrowStatusProps {
  transaction: EscrowTransaction;
  showDetails?: boolean;
}

export const EscrowStatus: React.FC<EscrowStatusProps> = ({ 
  transaction, 
  showDetails = true 
}) => {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
    locked: { icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Secured' },
    released: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Released' },
    disputed: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', label: 'Disputed' }
  };

  const config = statusConfig[transaction.status];
  const Icon = config.icon;

  if (!showDetails) {
    return (
      <Badge className={`${config.bg} ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5" />
          Escrow Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            <span className="font-medium">{config.label}</span>
          </div>
          <Badge className={`${config.bg} ${config.color}`}>
            ${transaction.amount.toLocaleString()}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform Fee (2.5%)</span>
            <span>${transaction.platformFee.toFixed(2)}</span>
          </div>
          {transaction.escrowFee > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Escrow Fee</span>
              <span>${transaction.escrowFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Net Amount</span>
            <span>${(transaction.amount - transaction.platformFee - transaction.escrowFee).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Created: {new Date(transaction.createdAt).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};
