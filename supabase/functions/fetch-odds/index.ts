import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sport = 'upcoming' } = await req.json().catch(() => ({}));
    
    const oddsApiKey = Deno.env.get('ODDS_API_KEY');
    if (!oddsApiKey) {
      console.error('ODDS_API_KEY not found in environment variables');
      return getMockOddsResponse();
    }

    const BASE_URL = 'https://api.the-odds-api.com/v4';
    const url = `${BASE_URL}/sports/${sport}/odds?apiKey=${oddsApiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`;

    console.log(`Fetching odds from: ${url.replace(oddsApiKey, '[REDACTED]')}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Odds API returned ${response.status}, falling back to mock data`);
      return getMockOddsResponse();
    }
    
    const data = await response.json();
    
    return new Response(
      JSON.stringify(data || []),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching odds:', error);
    return getMockOddsResponse();
  }
});

function getMockOddsResponse(): Response {
  const mockOdds: OddsData[] = [
    {
      id: '1',
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
          }
        ]
      }]
    },
    {
      id: '2',
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
          }
        ]
      }]
    }
  ];

  return new Response(
    JSON.stringify(mockOdds),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}