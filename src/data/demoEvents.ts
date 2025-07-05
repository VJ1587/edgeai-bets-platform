
import type { DemoEvent } from '@/types/edgestake';

export const demoEvents: DemoEvent[] = [
  // Real Sports Events - Summer 2025
  {
    id: 'us-open-tennis-2025',
    title: 'US Open Tennis Championships 2025',
    category: 'sports',
    date: '2025-07-08T16:00:00Z',
    description: 'Singles/doubles matchups, total sets, upset odds',
    odds: {
      'Djokovic Win': -150,
      'Sinner Win': +130,
      'Total Sets Over 4.5': +110
    },
    featured: true
  },
  {
    id: 'nba-summer-league-2025',
    title: 'NBA Summer League Finals',
    category: 'sports',
    date: '2025-07-17T21:00:00Z',
    description: 'Game results, point spreads, props',
    odds: {
      'Lakers -5.5': -110,
      'Celtics +5.5': -110,
      'Over 215.5': -105
    },
    featured: true
  },
  {
    id: 'wnba-aces-liberty',
    title: 'Las Vegas Aces vs New York Liberty',
    category: 'sports',
    date: '2025-07-15T20:00:00Z',
    description: 'Win margin brackets, halftime leaders',
    odds: {
      'Aces -7': -110,
      'Liberty +7': -110,
      'A\'ja Wilson 25+ Points': +140
    },
    featured: false
  },
  {
    id: 'fifa-qualifiers-2025',
    title: 'FIFA 2026 World Cup Qualifiers',
    category: 'sports',
    date: '2025-07-22T19:00:00Z',
    description: 'National team matchups, group outcomes',
    odds: {
      'USA to Qualify': -200,
      'Mexico to Win Group': +180,
      'Canada Top Scorer': +250
    },
    featured: false
  },
  {
    id: 'cricket-ind-aus-t20',
    title: 'India vs Australia T20 Series',
    category: 'sports',
    date: '2025-07-25T14:30:00Z',
    description: 'Run lines, first innings winner, most sixes',
    odds: {
      'India Win Series 3-1': +175,
      'Australia Win Series 3-2': +200,
      'Kohli Most Runs': +120
    },
    featured: false
  },

  // Esports & Gaming Events
  {
    id: 'fortnite-summer-2025',
    title: 'Fortnite Summer Invitational 2025',
    category: 'esports',
    date: '2025-06-28T18:00:00Z',
    description: 'Solo vs squad leaderboard duels',
    odds: {
      'Bugha to Win': +300,
      'Aqua Top 3': +150,
      'NA Player Wins': -120
    },
    featured: true
  },
  {
    id: 'cod-warzone-clash',
    title: 'Call of Duty: Warzone Championship',
    category: 'esports',
    date: '2025-07-05T20:00:00Z',
    description: 'Damage per team, custom killrace lobbies',
    odds: {
      'FaZe Clan Win': +200,
      'OpTic Gaming Win': +180,
      'Over 50 Total Kills': -110
    },
    featured: false
  },
  {
    id: 'madden-nfl-2026-duel',
    title: 'Madden NFL 2026 Console Championship',
    category: 'gaming',
    date: '2025-07-12T19:00:00Z',
    description: 'QB duel stats, late-game performance props',
    odds: {
      'Problem Wright Win': +140,
      'Volterax Win': +160,
      'Game Goes to OT': +300
    },
    featured: false
  },
  {
    id: 'ncaa-basketball-sim-2026',
    title: 'NCAA Basketball Game Sims 2026',
    category: 'gaming',
    date: '2025-03-15T18:00:00Z',
    description: 'March-style bracket with per-game spreads',
    odds: {
      'Duke -3.5 vs UNC': -110,
      'Gonzaga to Final Four': +250,
      'Under 68.5 Total Games': +105
    },
    featured: false
  },
  {
    id: 'nba2k-summer-league',
    title: 'NBA 2K Summer League 2026',
    category: 'gaming',
    date: '2025-07-20T16:00:00Z',
    description: 'Draft pick showdowns, shot percentage challenges',
    odds: {
      'Wembanyama 60+ Points': +180,
      'LeBron Triple-Double': +120,
      'Game Under 220': -105
    },
    featured: false
  },
  {
    id: 'roblox-tournaments',
    title: 'Roblox Skill Championships',
    category: 'gaming',
    date: '2025-07-30T15:00:00Z',
    description: 'Obstacle course timing, treasure map competitions',
    odds: {
      'Speed Run Under 5 Min': +200,
      'Player1 vs Player2': -110,
      'Perfect Score': +500
    },
    featured: false
  },
  {
    id: 'fifa-console-world-cup',
    title: 'FIFA Console World Cup 2026',
    category: 'gaming',
    date: '2025-08-15T14:00:00Z',
    description: 'Country vs. country console matches',
    odds: {
      'Brazil Win Tournament': +300,
      'Argentina vs France Final': +400,
      'Messi Scores 10+ Goals': +250
    },
    featured: true
  }
];
