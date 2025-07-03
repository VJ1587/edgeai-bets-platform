
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

interface OddsData {
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

function createMockOdds(): OddsData[] {
  const now = Date.now();
  
  return [
    {
      id: 'mock-1',
      sport_key: 'basketball_wnba',
      sport_title: 'WNBA',
      commence_time: new Date(now + 3600000).toISOString(),
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
              { name: 'New York Liberty', price: 120 }
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
      commence_time: new Date(now + 5400000).toISOString(),
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
              { name: 'San Francisco Giants', price: 140 }
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
    }
  ];
}

function createMockResponse(): Response {
  console.log('📦 Returning mock odds data');
  
  const mockOdds = createMockOdds();
  const responseHeaders = new Headers();
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  responseHeaders.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  responseHeaders.set('Content-Type', 'application/json');

  return new Response(JSON.stringify(mockOdds), {
    headers: responseHeaders,
    status: 200,
  });
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
    headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    return new Response(null, { headers, status: 200 });
  }

  try {
    console.log('🔍 Fetch-odds function called');
    
    // Parse request body safely
    let requestBody: any = {};
    try {
      const text = await req.text();
      if (text) {
        requestBody = JSON.parse(text);
      }
    } catch (parseError) {
      console.log('No JSON body provided, using defaults');
    }
    
    const sport = requestBody.sport || 'upcoming';
    console.log(`📊 Requested sport: ${sport}`);
    
    // Get the API key from environment
    const oddsApiKey = Deno.env.get('ODDS_API_KEY') || Deno.env.get('odds_API');
    
    if (!oddsApiKey) {
      console.warn('⚠️ ODDS_API_KEY not found, returning mock data');
      return createMockResponse();
    }

    const BASE_URL = 'https://api.the-odds-api.com/v4';
    let url: string;
    
    // Handle different sport requests
    if (sport === 'upcoming') {
      url = `${BASE_URL}/sports/upcoming/odds?apiKey=${oddsApiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`;
    } else {
      url = `${BASE_URL}/sports/${sport}/odds?apiKey=${oddsApiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`;
    }

    console.log(`🌐 Fetching from API: ${url.replace(oddsApiKey, '[REDACTED]')}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Lovable-Sports-App/1.0'
      }
    });
    
    if (!response.ok) {
      console.warn(`⚠️ Odds API returned ${response.status}: ${response.statusText}`);
      const errorText = await response.text();
      console.error('API Error details:', errorText);
      return createMockResponse();
    }
    
    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.length} games from real API`);
    
    // Transform the data to match our expected format
    const transformedData = data.map((game: any) => {
      const bookmakers = game.bookmakers.map((bookmaker: any) => {
        const markets = bookmaker.markets.map((market: any) => {
          const outcomes = market.outcomes.map((outcome: any) => ({
            name: outcome.name,
            price: outcome.price,
            point: outcome.point
          }));
          return {
            key: market.key,
            outcomes: outcomes
          };
        });
        return {
          key: bookmaker.key,
          title: bookmaker.title,
          markets: markets
        };
      });

      return {
        id: game.id,
        sport_key: game.sport_key,
        sport_title: game.sport_title,
        commence_time: game.commence_time,
        home_team: game.home_team,
        away_team: game.away_team,
        bookmakers: bookmakers
      };
    });
    
    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
    responseHeaders.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    responseHeaders.set('Content-Type', 'application/json');
    
    return new Response(JSON.stringify(transformedData), {
      headers: responseHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('❌ Error in fetch-odds function:', error);
    return createMockResponse();
  }
});
