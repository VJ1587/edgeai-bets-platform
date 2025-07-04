
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Share, Copy, Trophy, Users, Target } from 'lucide-react';
import { ShareService, ShareChannel } from '@/services/shareService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  betId: string;
  betType: 'duel' | 'syndicate' | 'gaming' | 'bookie_line';
  amount?: number;
  title?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onClose,
  betId,
  betType,
  amount,
  title
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shareLink, setShareLink] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [channels] = useState<ShareChannel[]>(ShareService.getShareChannels());

  useEffect(() => {
    if (open && user) {
      generateLink();
    }
  }, [open, user, betId]);

  const generateLink = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const link = await ShareService.generateShareLink({
        bet_id: betId,
        type: betType,
        source_user_id: user.id
      });
      setShareLink(link);
    } catch (error) {
      console.error('Error generating share link:', error);
      toast({
        title: "Error",
        description: "Failed to generate share link",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (channel: ShareChannel) => {
    if (!shareLink) return;
    
    const message = ShareService.getShareMessage(betType, amount);
    channel.shareFunction(shareLink, message);
    
    toast({
      title: "Share Link Ready!",
      description: `Shared via ${channel.name}`,
    });
  };

  const copyToClipboard = () => {
    if (!shareLink) return;
    
    const message = ShareService.getShareMessage(betType, amount);
    navigator.clipboard.writeText(`${message}\n\n${shareLink}`);
    
    toast({
      title: "Copied!",
      description: "Share message and link copied to clipboard",
    });
  };

  const getBetTypeIcon = () => {
    switch (betType) {
      case 'duel': return <Target className="h-5 w-5" />;
      case 'syndicate': return <Users className="h-5 w-5" />;
      case 'gaming': return <Trophy className="h-5 w-5" />;
      case 'bookie_line': return <Share className="h-5 w-5" />;
      default: return <Share className="h-5 w-5" />;
    }
  };

  const getBetTypeLabel = () => {
    switch (betType) {
      case 'duel': return 'King\'s Duel';
      case 'syndicate': return 'Arena Syndicate';
      case 'gaming': return 'Gaming Challenge';
      case 'bookie_line': return 'Bookie Line';
      default: return 'Challenge';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getBetTypeIcon()}
            Invite to {getBetTypeLabel()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Challenge Preview */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{getBetTypeLabel()}</Badge>
                {amount && (
                  <Badge variant="outline" className="font-bold">
                    ${amount.toFixed(2)}
                  </Badge>
                )}
              </div>
              {title && (
                <p className="font-medium text-sm mb-2">{title}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Both players get $5 bonus when challenge completes!
              </p>
            </CardContent>
          </Card>

          {/* Copy Link Button */}
          <Button 
            onClick={copyToClipboard} 
            disabled={loading || !shareLink}
            variant="outline" 
            className="w-full"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Share Message
          </Button>

          {/* Share Channels */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Share via:</p>
            <div className="grid grid-cols-2 gap-2">
              {channels.map((channel) => (
                <Button
                  key={channel.id}
                  onClick={() => handleShare(channel)}
                  disabled={loading || !shareLink}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                >
                  <span className="mr-2">{channel.icon}</span>
                  {channel.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Referral Info */}
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Referral Bonus</span>
            </div>
            <p className="text-xs text-green-700">
              You and your opponent both get $5 when the challenge completes!
            </p>
          </div>

          <Button onClick={onClose} variant="secondary" className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
