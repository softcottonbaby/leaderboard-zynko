export default async function handler(req, res) {
  const RUXBET_API_KEY = process.env.RUXBET_API_KEY;
  
  if (!RUXBET_API_KEY) {
    return res.status(500).json({ 
      error: 'RUXBET_API_KEY not found in .env.local',
      fix: 'Add RUXBET_API_KEY=pk__iMqZ7F2LqgU9J6m1R4BxHfdks-skvL- to your .env.local file'
    });
  }

  try {
    // Try fetching all leaderboards (no code filter)
    const response = await fetch('https://api.ruxbet.com/users/me/leaderboards', {
      headers: {
        'Authorization': `Bearer ${RUXBET_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    const status = response.status;
    const data = await response.json();

    // Pretty print the result
    res.status(200).json({
      status: status,
      apiKeyWorking: status === 200,
      message: status === 200 && Array.isArray(data) && data.length > 0
        ? `✅ FOUND ${data.length} LEADERBOARD(S)! Use the "name" as your campaign code`
        : status === 200 && Array.isArray(data) && data.length === 0
        ? '❌ No leaderboards found - create a campaign in Ruxbet dashboard first'
        : `❌ API Error: ${data.message || 'Unknown error'}`,
      data: data,
      nextStep: Array.isArray(data) && data.length > 0
        ? `Update apiEndpoint to: /api/ruxbet-leaderboard?code=${data[0].name}`
        : 'Contact Ruxbet support with your API key'
    });

  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      hint: 'Network error or API down'
    });
  }
}