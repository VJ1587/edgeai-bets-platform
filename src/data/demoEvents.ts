
import type { DemoEvent } from '@/types/edgestake';

export const demoEvents: DemoEvent[] = [
  // Real Sports Events
  {
    id: 'us-open-2025',
    title: 'US Open Tennis 2025 - Djokovic vs Alcaraz',
    category: 'sports',
    date: '2025-07-15',
    odds: { 'Djokovic Win': 2.1, 'Alcaraz Win': 1.8, 'Total Sets Over 4.5': 1.9 },
    description: 'Epic showdown between tennis legends',
    featured: true
  },
  {
    id: 'nba-summer-league',
    title: 'NBA Summer League - Lakers vs Warriors',
    category: 'sports',
    date: '2025-07-10',
    odds: { 'Lakers +5.5': 1.9, 'Warriors -5.5': 1.9, 'Over 220.5': 1.85 },
    description: 'Young stars battle in Vegas summer showcase'
  },
  {
    id: 'wnba-aces-sun',
    title: 'WNBA - Las Vegas Aces vs Connecticut Sun',
    category: 'sports',
    date: '2025-07-08',
    odds: { 'Aces -4.5': 1.9, 'Sun +4.5': 1.9, 'Wilson 25+ Points': 2.4 },
    description: 'Championship contenders clash'
  },
  {
    id: 'fifa-2026-qualifiers',
    title: 'FIFA 2026 World Cup Qualifiers - Brazil vs Argentina',
    category: 'sports',
    date: '2025-09-05',
    odds: { 'Brazil Win': 2.2, 'Draw': 3.1, 'Argentina Win': 3.4 },
    description: 'South American giants battle for World Cup spot',
    featured: true
  },
  {
    id: 'cricket-ind-aus',
    title: 'Cricket T20 - India vs Australia',
    category: 'sports',
    date: '2025-07-20',
    odds: { 'India Win': 1.7, 'Australia Win': 2.1, 'Kohli Top Scorer': 3.2 },
    description: 'Border-Gavaskar T20 series finale'
  },
  
  // Esports & Gaming Events
  {
    id: 'fortnite-summer-2025',
    title: 'Fortnite Summer Invitational 2025',
    category: 'esports',
    date: '2025-06-15',
    odds: { 'Bugha Victory': 4.5, 'Aqua Victory': 3.8, 'Top 10 Finish': 1.4 },
    description: 'Elite players compete for $1M prize pool',
    featured: true
  },
  {
    id: 'cod-warzone-clash',
    title: 'Call of Duty: Warzone Summer Clash',
    category: 'esports',
    date: '2025-07-25',
    odds: { 'FaZe Clan Win': 2.8, 'OpTic Win': 3.1, 'Most Kills Team': 2.2 },
    description: 'Pro teams battle in custom lobbies'
  },
  {
    id: 'madden-nfl-2026',
    title: 'Madden NFL 2026 Console Championship',
    category: 'gaming',
    date: '2025-08-12',
    odds: { 'Problem Win': 2.4, 'Joke Win': 2.9, 'Over 45.5 Points': 1.8 },
    description: 'Top Madden players compete for supremacy'
  },
  {
    id: 'nba2k-summer-league',
    title: 'NBA 2K26 Summer League Finals',
    category: 'gaming',
    date: '2025-07-30',
    odds: { 'Lakers 2K Win': 1.9, 'Celtics 2K Win': 1.9, 'OT Needed': 4.2 },
    description: 'Console basketball at its finest'
  },
  {
    id: 'fifa-console-wcup',
    title: 'FIFA Console World Cup 2026',
    category: 'gaming',
    date: '2025-11-15',
    odds: { 'Brazil Win': 3.5, 'France Win': 4.1, 'England Win': 5.2 },
    description: 'Nations compete in virtual football glory',
    featured: true
  }
];
