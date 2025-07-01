
const ODDS_API_KEY = 'demo-key'; // You'll need to get a real API key from the-odds-api.com
const BASE_URL = 'https://api.the-odds-api.com/v4';

export interface OddsData {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
        point?: number;
      }>;
    }>;
  }>;
}

export const fetchLiveOdds = async (sport = 'upcoming'): Promise<OddsData[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/sports/${sport}/odds?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`
    );
    
    if (!response.ok) {
      // Return mock data for demo purposes
      return getMockOdds();
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching odds:', error);
    return getMockOdds();
  }
};

const getMockOdds = (): OddsData[] => [
  {
    id: '1',
    sport_key: 'basketball_nba',
    sport_title: 'NBA',
    commence_time: new Date(Date.now() + 3600000).toISOString(),
    home_team: 'Los Angeles Lakers',
    away_team: 'Golden State Warriors',
    bookmakers: [{
      key: 'draftkings',
      title: 'DraftKings',
      markets: [
        {
          key: 'h2h',
          outcomes: [
            { name: 'Los Angeles Lakers', price: -110 },
            { name: 'Golden State Warriors', price: +105 }
          ]
        },
        {
          key: 'spreads',
          outcomes: [
            { name: 'Los Angeles Lakers', price: -110, point: -2.5 },
            { name: 'Golden State Warriors', price: -110, point: 2.5 }
          ]
        },
        {
          key: 'totals',
          outcomes: [
            { name: 'Over', price: -110, point: 225.5 },
            { name: 'Under', price: -110, point: 225.5 }
          ]
        }
      ]
    }]
  },
  {
    id: '2',
    sport_key: 'soccer_epl',
    sport_title: 'Premier League',
    commence_time: new Date(Date.now() + 7200000).toISOString(),
    home_team: 'Manchester United',
    away_team: 'Liverpool',
    bookmakers: [{
      key: 'fanduel',
      title: 'FanDuel',
      markets: [
        {
          key: 'h2h',
          outcomes: [
            { name: 'Manchester United', price: +180 },
            { name: 'Liverpool', price: -120 },
            { name: 'Draw', price: +240 }
          ]
        },
        {
          key: 'totals',
          outcomes: [
            { name: 'Over', price: -105, point: 2.5 },
            { name: 'Under', price: -115, point: 2.5 }
          ]
        }
      ]
    }]
  },
  {
    id: '3',
    sport_key: 'baseball_mlb',
    sport_title: 'MLB',
    commence_time: new Date(Date.now() + 5400000).toISOString(),
    home_team: 'New York Yankees',
    away_team: 'Boston Red Sox',
    bookmakers: [{
      key: 'betmgm',
      title: 'BetMGM',
      markets: [
        {
          key: 'h2h',
          outcomes: [
            { name: 'New York Yankees', price: -140 },
            { name: 'Boston Red Sox', price: +120 }
          ]
        },
        {
          key: 'spreads',
          outcomes: [
            { name: 'New York Yankees', price: -110, point: -1.5 },
            { name: 'Boston Red Sox', price: -110, point: 1.5 }
          ]
        },
        {
          key: 'totals',
          outcomes: [
            { name: 'Over', price: -110, point: 8.5 },
            { name: 'Under', price: -110, point: 8.5 }
          ]
        }
      ]
    }]
  },
  {
    id: '4',
    sport_key: 'americanfootball_nfl',
    sport_title: 'NFL',
    commence_time: new Date(Date.now() + 10800000).toISOString(),
    home_team: 'Kansas City Chiefs',
    away_team: 'Buffalo Bills',
    bookmakers: [{
      key: 'caesars',
      title: 'Caesars',
      markets: [
        {
          key: 'h2h',
          outcomes: [
            { name: 'Kansas City Chiefs', price: -150 },
            { name: 'Buffalo Bills', price: +130 }
          ]
        },
        {
          key: 'spreads',
          outcomes: [
            { name: 'Kansas City Chiefs', price: -110, point: -3.5 },
            { name: 'Buffalo Bills', price: -110, point: 3.5 }
          ]
        },
        {
          key: 'totals',
          outcomes: [
            { name: 'Over', price: -110, point: 47.5 },
            { name: 'Under', price: -110, point: 47.5 }
          ]
        }
      ]
    }]
  },
  {
    id: '5',
    sport_key: 'icehockey_nhl',
    sport_title: 'NHL',
    commence_time: new Date(Date.now() + 14400000).toISOString(),
    home_team: 'Toronto Maple Leafs',
    away_team: 'Montreal Canadiens',
    bookmakers: [{
      key: 'betrivers',
      title: 'BetRivers',
      markets: [
        {
          key: 'h2h',
          outcomes: [
            { name: 'Toronto Maple Leafs', price: -125 },
            { name: 'Montreal Canadiens', price: +105 }
          ]
        },
        {
          key: 'totals',
          outcomes: [
            { name: 'Over', price: -110, point: 6.5 },
            { name: 'Under', price: -110, point: 6.5 }
          ]
        }
      ]
    }]
  },
  {
    id: '6',
    sport_key: 'tennis_atp',
    sport_title: 'ATP Tennis',
    commence_time: new Date(Date.now() + 18000000).toISOString(),
    home_team: 'Novak Djokovic',
    away_team: 'Rafael Nadal',
    bookmakers: [{
      key: 'pointsbet',
      title: 'PointsBet',
      markets: [
        {
          key: 'h2h',
          outcomes: [
            { name: 'Novak Djokovic', price: +110 },
            { name: 'Rafael Nadal', price: -130 }
          ]
        }
      ]
    }]
  },
  {
    id: '7',
    sport_key: 'basketball_ncaab',
    sport_title: 'NCAA Basketball',
    commence_time: new Date(Date.now() + 21600000).toISOString(),
    home_team: 'Duke Blue Devils',
    away_team: 'UNC Tar Heels',
    bookmakers: [{
      key: 'unibet',
      title: 'Unibet',
      markets: [
        {
          key: 'h2h',
          outcomes: [
            { name: 'Duke Blue Devils', price: -200 },
            { name: 'UNC Tar Heels', price: +170 }
          ]
        },
        {
          key: 'spreads',
          outcomes: [
            { name: 'Duke Blue Devils', price: -110, point: -5.5 },
            { name: 'UNC Tar Heels', price: -110, point: 5.5 }
          ]
        }
      ]
    }]
  },
  {
    id: '8',
    sport_key: 'soccer_uefa_champs_league',
    sport_title: 'Champions League',
    commence_time: new Date(Date.now() + 25200000).toISOString(),
    home_team: 'Real Madrid',
    away_team: 'Barcelona',
    bookmakers: [{
      key: 'bet365',
      title: 'Bet365',
      markets: [
        {
          key: 'h2h',
          outcomes: [
            { name: 'Real Madrid', price: +140 },
            { name: 'Barcelona', price: +160 },
            { name: 'Draw', price: +220 }
          ]
        }
      ]
    }]
  }
];
