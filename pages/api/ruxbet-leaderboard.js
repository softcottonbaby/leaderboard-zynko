// pages/api/ruxbet-leaderboard.js
// Proxy for Ruxbet API v2.0 with caching

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
      leaderboards: [],
      error: 'API key not configured'
    };
    cache = { data: fallbackData, timestamp: now };
    return res.status(200).json(fallbackData);
  }

  try {
    // Get campaign code from query or use default
    // Your campaign code is likely 'zynko' based on your site
    const campaignCode = req.query.code || 'zynko';
    
    // Build URL - v2.0 uses /users/me/leaderboards with ?code= query param
    let url = 'https://api.ruxbet.com/users/me/leaderboards';
    
    // Add campaign code if provided
    if (campaignCode) {
      url += `?code=${encodeURIComponent(campaignCode)}`;
    }

    console.log('Fetching from:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${RUXBET_API_KEY}`,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ruxbet API error ${response.status}:`, errorText);
      throw new Error(`Ruxbet API error: ${response.status}`);
    }

    // v2.0 returns array directly for all, or single object for specific code
    const data = await response.json();
    
    console.log('API Response:', data);

    // Normalize response - always return { leaderboards: [...] }
    let normalizedData;
    
    if (Array.isArray(data)) {
      // Got array of leaderboards (no code filter or multiple results)
      normalizedData = { leaderboards: data };
    } else if (data && typeof data === 'object') {
      // Got single leaderboard object (when using ?code=)
      normalizedData = { leaderboards: [data] };
    } else {
      normalizedData = { leaderboards: [] };
    }

    cache = { data: normalizedData, timestamp: now };
    return res.status(200).json(normalizedData);

  } catch (error) {
    console.error('Ruxbet API error:', error.message);
    
    // Return cached data even if expired
    if (cache.data) {
      console.log('Returning stale cached data');
      return res.status(200).json(cache.data);
    }

    // Return empty fallback
    return res.status(200).json({
      leaderboards: [],
      error: error.message
    });
  }
}