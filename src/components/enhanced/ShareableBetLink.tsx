
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  Copy, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Gamepad2,
  Clock,
  DollarSign
} from 'lucide-react';
import type { ShareableLink } from '@/types/edgestake';

interface ShareableBetLinkProps {
  betData: {
    id: string;
    type: 'duel' | 'syndicate' | 'gamer_match' | 'custom_market';
    title: string;
    amount: number;
    sport?: string;
    odds?: Record<string, number>;
    expiresAt: string;
  };
  onShare: (channel: string) => void;
}

export const ShareableBetLink: React.FC<ShareableBetLinkProps> = ({
  betData,
  onShare
}) => {
  const { toast } = useToast();
  const [customMessage, setCustomMessage] = useState('');
  
  // Generate short link (mock implementation)
  const shortUrl = `https://edgestake.ai/join/${betData.id}`;
  
  const shareChannels = [
    { id: 'sms', name: 'Text Message', icon: MessageSquare, color: 'text-green-600' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'text-green-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'text-blue-400' },
    { id: 'discord', name: 'Discord', icon: Gamepad2, color: 'text-indigo-500' },
    { id: 'xbox', name: 'Xbox Live', icon: Gamepad2, color: 'text-green-600' },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast({
        title: "Link Copied!",
        description: "Share link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const handleChannelShare = (channelId: string) => {
    onShare(channelId);
    toast({
      title: "Shared Successfully!",
      description: `Bet shared via ${shareChannels.find(c => c.id === channelId)?.name}`,
    });
  };

  const getBetTypeDisplay = (type: string) => {
    switch (type) {
      case 'duel': return '⚔️ 1v1 Challenge';
      case 'syndicate': return '🏟️ Syndicate Join';
      case 'gamer_match': return '🎮 Gamer vs Gamer';
      default: return '📈 Custom Market';
    }
  };

  const timeUntilExpiry = () => {
    const now = new Date();
    const expiry = new Date(betData.expiresAt);
    const diffInHours = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
    return diffInHours > 0 ? `${diffInHours}h remaining` : 'Expired';
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Share2 className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <CardTitle className="text-lg">Share Your Bet</CardTitle>
            <p className="text-sm text-muted-foreground">Invite others to join the action</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Bet Preview */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-sm">
              {getBetTypeDisplay(betData.type)}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timeUntilExpiry()}
            </div>
          </div>
          <h3 className="font-medium mb-2">{betData.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-bold text-green-600">${betData.amount.toLocaleString()}</span>
            </div>
            {betData.sport && (
              <Badge variant="secondary" className="text-xs">
                {betData.sport}
              </Badge>
            )}
          </div>
        </div>

        {/* Share Link */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Share Link</label>
          <div className="flex gap-2">
            <Input 
              value={shortUrl} 
              readOnly 
              className="font-mono text-sm"
            />
            <Button variant="outline" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Share Channels */}
        <Tabs defaultValue="social" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="gaming">Gaming Platforms</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-2">
            {shareChannels.slice(0, 4).map((channel) => {
              const IconComponent = channel.icon;
              return (
                <Button
                  key={channel.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleChannelShare(channel.id)}
                >
                  <IconComponent className={`h-4 w-4 mr-3 ${channel.color}`} />
                  Share via {channel.name}
                </Button>
              );
            })}
          </TabsContent>

          <TabsContent value="gaming" className="space-y-2">
            {shareChannels.slice(4).map((channel) => {
              const IconComponent = channel.icon;
              return (
                <Button
                  key={channel.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleChannelShare(channel.id)}
                >
                  <IconComponent className={`h-4 w-4 mr-3 ${channel.color}`} />
                  Share via {channel.name}
                </Button>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Custom Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Message (Optional)</label>
          <Input
            placeholder="Add a personal message..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Save Draft
          </Button>
          <Button className="flex-1">
            Share Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
