export default async function handler(req, res) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 14);

    const PUBLIC_KEY = 'IJnsemuVsOqzpaLirMzGwhQbcGedfh';
    const PRIVATE_KEY = 'eNpecoKkLYFKfmiEqncYKjFbabhfOh';

    const response = await fetch('https://api.csdrop.com/v1/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        // Standardizing the User-Agent to a very common Windows/Chrome version
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'x-public-key': PUBLIC_KEY,
        'x-private-key': PRIVATE_KEY,
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
      body: JSON.stringify({
        type: 'WAGER',
        startTime: Math.floor(startDate.getTime() / 1000),
        endTime: Math.floor(endDate.getTime() / 1000),
        limit: 50
      }),
    });

    if (!response.ok) {
      // If we still get a 403, it's a hard IP block
      return res.status(response.status).json({ 
        error: "IP_BLOCK", 
        message: "Your hosting provider's IP is blocked by CSDrop firewall." 
      });
    }

    const data = await response.json();
    return res.status(200).json({ rankings: data.rankings || data.players || [] });

  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
}