
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
  console.log(`🔄 Using demo data for sport: ${sport}`);
  
  // Always return mock data for now
  return getMockOdds();
};

// Function to fetch odds for specific sports
export const fetchOddsBySport = async (sportKey: string): Promise<OddsData[]> => {
  return fetchLiveOdds(sportKey);
};

// Function to get available sports
export const getAvailableSports = async (): Promise<string[]> => {
  try {
    const data = await fetchLiveOdds();
    const sports = Array.from(new Set(data.map(game => game.sport_title)));
    return sports;
  } catch (error) {
    console.error('Error getting available sports:', error);
    return ['WNBA', 'MLB', 'UFC', 'Boxing', 'MLS'];
  }
};

const getMockOdds = (): OddsData[] => {
  console.log('📦 Generating fresh mock odds data');
  
  return [
    {
      id: 'mock-1',
      sport_key: 'basketball_wnba',
      sport_title: 'WNBA',
      commence_time: new Date(Date.now() + 3600000).toISOString(),
      home_team: 'Las Vegas Aces',
      away_team: 'New York Liberty',
      bookmakers: [{
        key: 'draftkings',
        title: 'DraftKings',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'Las Vegas Aces', price: -140 },
              { name: 'New York Liberty', price: +120 }
            ]
          },
          {
            key: 'spreads',
            outcomes: [
              { name: 'Las Vegas Aces', price: -110, point: -3.5 },
              { name: 'New York Liberty', price: -110, point: 3.5 }
            ]
          },
          {
            key: 'totals',
            outcomes: [
              { name: 'Over', price: -110, point: 165.5 },
              { name: 'Under', price: -110, point: 165.5 }
            ]
          }
        ]
      }]
    },
    {
      id: 'mock-2',
      sport_key: 'baseball_mlb',
      sport_title: 'MLB',
      commence_time: new Date(Date.now() + 5400000).toISOString(),
      home_team: 'Los Angeles Dodgers',
      away_team: 'San Francisco Giants',
      bookmakers: [{
        key: 'fanduel',
        title: 'FanDuel',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'Los Angeles Dodgers', price: -165 },
              { name: 'San Francisco Giants', price: +140 }
            ]
          },
          {
            key: 'spreads',
            outcomes: [
              { name: 'Los Angeles Dodgers', price: -110, point: -1.5 },
              { name: 'San Francisco Giants', price: -110, point: 1.5 }
            ]
          },
          {
            key: 'totals',
            outcomes: [
              { name: 'Over', price: -105, point: 9.5 },
              { name: 'Under', price: -115, point: 9.5 }
            ]
          }
        ]
      }]
    },
    {
      id: 'mock-3',
      sport_key: 'mma_mixed_martial_arts',
      sport_title: 'UFC',
      commence_time: new Date(Date.now() + 7200000).toISOString(),
      home_team: 'Jon Jones',
      away_team: 'Tom Aspinall',
      bookmakers: [{
        key: 'betmgm',
        title: 'BetMGM',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'Jon Jones', price: -180 },
              { name: 'Tom Aspinall', price: +150 }
            ]
          }
        ]
      }]
    },
    {
      id: 'mock-4',
      sport_key: 'baseball_mlb',
      sport_title: 'MLB',
      commence_time: new Date(Date.now() + 10800000).toISOString(),
      home_team: 'New York Yankees',
      away_team: 'Boston Red Sox',
      bookmakers: [{
        key: 'caesars',
        title: 'Caesars',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'New York Yankees', price: -130 },
              { name: 'Boston Red Sox', price: +110 }
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
      id: 'mock-5',
      sport_key: 'boxing',
      sport_title: 'Boxing',
      commence_time: new Date(Date.now() + 14400000).toISOString(),
      home_team: 'Canelo Alvarez',
      away_team: 'Jermall Charlo',
      bookmakers: [{
        key: 'betrivers',
        title: 'BetRivers',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'Canelo Alvarez', price: -250 },
              { name: 'Jermall Charlo', price: +200 }
            ]
          }
        ]
      }]
    },
    {
      id: 'mock-6',
      sport_key: 'basketball_wnba',
      sport_title: 'WNBA',
      commence_time: new Date(Date.now() + 18000000).toISOString(),
      home_team: 'Connecticut Sun',
      away_team: 'Seattle Storm',
      bookmakers: [{
        key: 'pointsbet',
        title: 'PointsBet',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'Connecticut Sun', price: +115 },
              { name: 'Seattle Storm', price: -135 }
            ]
          },
          {
            key: 'spreads',
            outcomes: [
              { name: 'Connecticut Sun', price: -110, point: 2.5 },
              { name: 'Seattle Storm', price: -110, point: -2.5 }
            ]
          },
          {
            key: 'totals',
            outcomes: [
              { name: 'Over', price: -110, point: 158.5 },
              { name: 'Under', price: -110, point: 158.5 }
            ]
          }
        ]
      }]
    },
    {
      id: 'mock-7',
      sport_key: 'soccer_usa_mls',
      sport_title: 'MLS',
      commence_time: new Date(Date.now() + 21600000).toISOString(),
      home_team: 'LAFC',
      away_team: 'LA Galaxy',
      bookmakers: [{
        key: 'unibet',
        title: 'Unibet',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'LAFC', price: +140 },
              { name: 'LA Galaxy', price: +160 },
              { name: 'Draw', price: +220 }
            ]
          },
          {
            key: 'totals',
            outcomes: [
              { name: 'Over', price: -110, point: 2.5 },
              { name: 'Under', price: -110, point: 2.5 }
            ]
          }
        ]
      }]
    },
    {
      id: 'mock-8',
      sport_key: 'baseball_mlb',
      sport_title: 'MLB',
      commence_time: new Date(Date.now() + 25200000).toISOString(),
      home_team: 'Atlanta Braves',
      away_team: 'Philadelphia Phillies',
      bookmakers: [{
        key: 'bet365',
        title: 'Bet365',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'Atlanta Braves', price: +125 },
              { name: 'Philadelphia Phillies', price: -145 }
            ]
          },
          {
            key: 'spreads',
            outcomes: [
              { name: 'Atlanta Braves', price: -110, point: 1.5 },
              { name: 'Philadelphia Phillies', price: -110, point: -1.5 }
            ]
          },
          {
            key: 'totals',
            outcomes: [
              { name: 'Over', price: -105, point: 9.0 },
              { name: 'Under', price: -115, point: 9.0 }
            ]
          }
        ]
      }]
    },
    {
      id: 'mock-9',
      sport_key: 'basketball_wnba',
      sport_title: 'WNBA',
      commence_time: new Date(Date.now() + 28800000).toISOString(),
      home_team: 'Phoenix Mercury',
      away_team: 'Minnesota Lynx',
      bookmakers: [{
        key: 'draftkings',
        title: 'DraftKings',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'Phoenix Mercury', price: +105 },
              { name: 'Minnesota Lynx', price: -125 }
            ]
          },
          {
            key: 'spreads',
            outcomes: [
              { name: 'Phoenix Mercury', price: -110, point: 2.5 },
              { name: 'Minnesota Lynx', price: -110, point: -2.5 }
            ]
          }
        ]
      }]
    },
    {
      id: 'mock-10',
      sport_key: 'soccer_usa_mls',
      sport_title: 'MLS',
      commence_time: new Date(Date.now() + 32400000).toISOString(),
      home_team: 'Inter Miami',
      away_team: 'Atlanta United',
      bookmakers: [{
        key: 'fanduel',
        title: 'FanDuel',
        markets: [
          {
            key: 'h2h',
            outcomes: [
              { name: 'Inter Miami', price: -180 },
              { name: 'Atlanta United', price: +320 },
              { name: 'Draw', price: +280 }
            ]
          }
        ]
      }]
    }
  ];
};
