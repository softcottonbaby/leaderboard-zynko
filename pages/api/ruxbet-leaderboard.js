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
    console.warn('RUXBET_API_KEY not configured, returning empty leaderboard');
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
    // Try to get specific leaderboard by name, or fetch all
    const leaderboardName = 'Sneakzy Weekly Race'; // Change this to your actual leaderboard name
    const encodedName = encodeURIComponent(leaderboardName);
    
    const response = await fetch(`https://api.ruxbet.com/leaderboards/export/${encodedName}`, {
      headers: {
        'Authorization': `Bearer ${RUXBET_API_KEY}`,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      // If specific name fails, try fetching all
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
      cache = { data: allData, timestamp: now };
      return res.status(200).json(allData);
    }

    const data = await response.json();
    // Wrap single leaderboard in data array for consistent format
    const wrappedData = { data: [data] };
    cache = { data: wrappedData, timestamp: now };
    return res.status(200).json(wrappedData);

  } catch (error) {
    console.error('Ruxbet API error:', error);
    
    // Return cached data even if expired, or empty fallback
    if (cache.data) {
      return res.status(200).json(cache.data);
    }

    const fallbackData = {
      data: [{
        name: 'Ruxbet Weekly Race',
        endsAt: '2026-03-09T23:59:59.000+00:00',
        standings: []
      }]
    };
    return res.status(200).json(fallbackData);
  }
}