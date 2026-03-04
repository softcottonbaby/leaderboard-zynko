// pages/api/ruxbet-leaderboard.js
// Proxy for Ruxbet API with caching to respect rate limits

const CACHE_DURATION = 60000; // 60 seconds cache
let cache = {
  data: null,
  timestamp: 0
};

export default async function handler(req, res) {
  // Check cache first
  const now = Date.now();
  if (cache.data && (now - cache.timestamp) < CACHE_DURATION) {
    return res.status(200).json(cache.data);
  }

  const RUXBET_API_KEY = process.env.RUXBET_API_KEY;
  
  // If no API key configured, return empty data gracefully
  if (!RUXBET_API_KEY) {
    console.warn('RUXBET_API_KEY not configured');
    const fallbackData = {
      data: [{
        name: 'Ruxbet Weekly Race',
        endsAt: '2026-03-09T23:59:59.000+00:00',
        standings: []
      }]
    };
    cache = { data: fallbackData, timestamp: now };
    return res.status(200).json(fallbackData);
  }

  try {
    // CHANGE THIS TO YOUR EXACT LEADERBOARD NAME FROM RUXBET DASHBOARD
    const leaderboardName = 'Zynko Weekly Race'; // <-- UPDATE THIS WITH YOUR ACTUAL LEADERBOARD NAME
    const encodedName = encodeURIComponent(leaderboardName);
    
    // FIXED: Removed space in URL
    const response = await fetch(`https://api.ruxbet.com/leaderboards/export/${encodedName}`, {
      headers: {
        'Authorization': `Bearer ${RUXBET_API_KEY}`,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.log(`Specific leaderboard not found (${response.status}), trying to fetch all...`);
      
      // Try fetching all leaderboards
      const allResponse = await fetch('https://api.ruxbet.com/leaderboards/export', {
        headers: {
          'Authorization': `Bearer ${RUXBET_API_KEY}`,
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!allResponse.ok) {
        throw new Error(`Ruxbet API error: ${allResponse.status}`);
      }

      const allData = await allResponse.json();
      console.log('Available leaderboards:', allData.data?.map(l => l.name));
      
      // If we got data array, use first one or find matching one
      if (allData.data && allData.data.length > 0) {
        cache = { data: allData, timestamp: now };
        return res.status(200).json(allData);
      }
      
      throw new Error('No leaderboards found');
    }

    const data = await response.json();
    const wrappedData = { data: [data] };
    cache = { data: wrappedData, timestamp: now };
    return res.status(200).json(wrappedData);

  } catch (error) {
    console.error('Ruxbet API error:', error.message);
    
    // Return cached data even if expired
    if (cache.data) {
      console.log('Returning cached data');
      return res.status(200).json(cache.data);
    }

    // Return empty fallback
    return res.status(200).json({
      data: [{
        name: 'Ruxbet Weekly Race',
        endsAt: '2026-03-09T23:59:59.000+00:00',
        standings: []
      }]
    });
  }
}