
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
    
    // Get the API key from Supabase secrets
    const oddsApiKey = Deno.env.get('ODDS_API_KEY') || Deno.env.get('odds_API');
    
    if (!oddsApiKey) {
      console.error('ODDS_API_KEY not found in environment variables');
      console.log('Available env vars:', Object.keys(Deno.env.toObject()));
      return getMockOddsResponse();
    }

    const BASE_URL = 'https://api.the-odds-api.com/v4';
    let url: string;
    
    // Handle different sport requests
    if (sport === 'upcoming') {
      url = `${BASE_URL}/sports/upcoming/odds?apiKey=${oddsApiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`;
    } else {
      url = `${BASE_URL}/sports/${sport}/odds?apiKey=${oddsApiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`;
    }

    console.log(`Fetching odds from: ${url.replace(oddsApiKey, '[REDACTED]')}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Odds API returned ${response.status}: ${response.statusText}`);
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return getMockOddsResponse();
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data.length} games from Odds API`);
    
    // Transform the data to match our expected format
    const transformedData = data.map((game: any) => ({
      id: game.id,
      sport_key: game.sport_key,
      sport_title: game.sport_title,
      commence_time: game.commence_time,
      home_team: game.home_team,
      away_team: game.away_team,
      bookmakers: game.bookmakers.map((bookmaker: any) => ({
        key: bookmaker.key,
        title: bookmaker.title,
        markets: bookmaker.markets.map((market: any) => ({
          key: market.key,
          outcomes: market.outcomes.map((outcome: any) => ({
            name: outcome.name,
            price: outcome.price,
            point: outcome.point
          }))
        }))
      }))
    }));
    
    return new Response(
      JSON.stringify(transformedData),
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
