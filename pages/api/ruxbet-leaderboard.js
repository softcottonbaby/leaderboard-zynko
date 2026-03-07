// pages/api/ruxbet-leaderboard.js
const CACHE_DURATION = 60000;
let cache = { data: null, timestamp: 0 };

export default async function handler(req, res) {
  const now = Date.now();
  if (cache.data && (now - cache.timestamp) < CACHE_DURATION) {
    return res.status(200).json(cache.data);
  }

  const RUXBET_API_KEY = process.env.RUXBET_API_KEY;
  if (!RUXBET_API_KEY) {
    return res.status(200).json({ standings: [], error: 'API key not configured' });
  }

  try {
    // Use the endpoint that works (without code parameter)
    const response = await fetch('https://api.ruxbet.com/users/me/leaderboards', {
      headers: {
        'Authorization': `Bearer ${RUXBET_API_KEY}`,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(200).json({ 
        standings: [], 
        error: errorData.message || `HTTP ${response.status}`
      });
    }

    // API returns array: [{name, endsAt, standings: []}]
    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(200).json({ 
        standings: [], 
        error: 'No leaderboards found'
      });
    }

    // Find the ZYNKO leaderboard (case-insensitive search)
    const targetLeaderboard = data.find(lb => 
      lb.name.toLowerCase().includes('zynko')
    ) || data[0]; // Fallback to first if no match

    const normalizedData = {
      name: targetLeaderboard.name,
      endsAt: targetLeaderboard.endsAt,
      standings: targetLeaderboard.standings || [],
      debug: `Found ${targetLeaderboard.standings?.length || 0} player(s) in "${targetLeaderboard.name}"`
    };
    
    cache = { data: normalizedData, timestamp: now };
    return res.status(200).json(normalizedData);

  } catch (err) {
    console.error('Ruxbet API error:', err);
    return res.status(200).json({ 
      standings: [], 
      error: 'Network error: ' + err.message
    });
  }
}