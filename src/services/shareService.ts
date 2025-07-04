
import { supabase } from '@/integrations/supabase/client';

export interface ShareLinkData {
  bet_id: string;
  type: 'duel' | 'syndicate' | 'gaming' | 'bookie_line';
  source_user_id: string;
  channel?: string;
  expires_at?: string;
}

export interface ShareChannel {
  id: string;
  name: string;
  icon: string;
  shareFunction: (link: string, message: string) => void;
}

export class ShareService {
  private static baseUrl = 'https://edgestake.ai'; // Update with actual domain

  static async generateShareLink(data: ShareLinkData): Promise<string> {
    // Create share link record in database
    const { data: shareLink, error } = await supabase
      .from('share_links')
      .insert({
        bet_id: data.bet_id,
        type: data.type,
        source_user_id: data.source_user_id,
        channel: data.channel,
        expires_at: data.expires_at || this.getDefaultExpiry(data.type),
        clicks: 0,
        conversions: 0
      })
      .select()
      .single();

    if (error) throw error;

    return `${this.baseUrl}/join/${data.bet_id}?ref=${data.source_user_id}&type=${data.type}&share_id=${shareLink.id}`;
  }

  private static getDefaultExpiry(type: string): string {
    const now = new Date();
    switch (type) {
      case 'duel':
      case 'gaming':
        now.setHours(now.getHours() + 24);
        break;
      case 'syndicate':
        now.setHours(now.getHours() + 72);
        break;
      case 'bookie_line':
        now.setDate(now.getDate() + 7); // 1 week default
        break;
      default:
        now.setHours(now.getHours() + 24);
    }
    return now.toISOString();
  }

  static getShareChannels(): ShareChannel[] {
    return [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: '💬',
        shareFunction: (link, message) => {
          const url = `https://wa.me/?text=${encodeURIComponent(message + ' ' + link)}`;
          window.open(url, '_blank');
        }
      },
      {
        id: 'sms',
        name: 'SMS',
        icon: '📱',
        shareFunction: (link, message) => {
          const url = `sms:?body=${encodeURIComponent(message + ' ' + link)}`;
          window.open(url);
        }
      },
      {
        id: 'twitter',
        name: 'Twitter',
        icon: '🐦',
        shareFunction: (link, message) => {
          const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(link)}`;
          window.open(url, '_blank');
        }
      },
      {
        id: 'instagram',
        name: 'Instagram',
        icon: '📷',
        shareFunction: (link, message) => {
          // Copy to clipboard for Instagram stories
          navigator.clipboard.writeText(message + ' ' + link);
          alert('Link copied! Paste in Instagram story or DM');
        }
      },
      {
        id: 'discord',
        name: 'Discord',
        icon: '🎮',
        shareFunction: (link, message) => {
          navigator.clipboard.writeText(message + ' ' + link);
          alert('Link copied! Paste in Discord');
        }
      },
      {
        id: 'xbox',
        name: 'Xbox Live',
        icon: '🎯',
        shareFunction: (link, message) => {
          navigator.clipboard.writeText(message + ' ' + link);
          alert('Link copied! Share via Xbox Live Chat');
        }
      },
      {
        id: 'playstation',
        name: 'PlayStation',
        icon: '🎮',
        shareFunction: (link, message) => {
          navigator.clipboard.writeText(message + ' ' + link);
          alert('Link copied! Share via PlayStation Messages');
        }
      },
      {
        id: 'email',
        name: 'Email',
        icon: '📧',
        shareFunction: (link, message) => {
          const subject = 'Join my EdgeStake Challenge';
          const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message + '\n\n' + link)}`;
          window.open(url);
        }
      }
    ];
  }

  static getShareMessage(betType: string, amount?: number): string {
    const messages = {
      duel: `Prove it. Join my 1v1 duel on EdgeStake${amount ? ` for $${amount}` : ''}. You win, you take the pot. You lose, the throne is mine.`,
      syndicate: `Join my syndicate pool on EdgeStake${amount ? ` - $${amount} target` : ''}. Together we rise, together we win.`,
      gaming: `Think you can beat me? Join my gaming challenge on EdgeStake${amount ? ` for $${amount}` : ''}. Let's see who's the real champion.`,
      bookie_line: `Check out this betting line I'm hosting on EdgeStake${amount ? ` - up to $${amount}` : ''}. Best odds guaranteed.`
    };
    
    return messages[betType as keyof typeof messages] || messages.duel;
  }

  static async trackClick(shareId: string): Promise<void> {
    const { error } = await supabase
      .from('share_links')
      .update({ 
        clicks: supabase.sql`clicks + 1`,
        last_clicked_at: new Date().toISOString()
      })
      .eq('id', shareId);
    
    if (error) console.error('Error tracking click:', error);
  }

  static async trackConversion(shareId: string): Promise<void> {
    const { error } = await supabase
      .from('share_links')
      .update({ 
        conversions: supabase.sql`conversions + 1`,
        converted_at: new Date().toISOString()
      })
      .eq('id', shareId);
    
    if (error) console.error('Error tracking conversion:', error);
  }

  static async processReferralBonus(sourceUserId: string, targetUserId: string, betId: string): Promise<void> {
    const bonusAmount = 5.00; // $5 bonus for both parties

    try {
      // Add bonus to both users' wallets
      const { error: sourceError } = await supabase
        .from('user_wallets')
        .update({
          balance: supabase.sql`balance + ${bonusAmount}`
        })
        .eq('user_id', sourceUserId);

      const { error: targetError } = await supabase
        .from('user_wallets')
        .update({
          balance: supabase.sql`balance + ${bonusAmount}`
        })
        .eq('user_id', targetUserId);

      if (!sourceError && !targetError) {
        // Log referral completion
        await supabase
          .from('referral_activity')
          .insert({
            source_user_id: sourceUserId,
            target_user_id: targetUserId,
            bet_id: betId,
            bonus_amount: bonusAmount,
            status: 'completed'
          });
      }
    } catch (error) {
      console.error('Error processing referral bonus:', error);
    }
  }
}
