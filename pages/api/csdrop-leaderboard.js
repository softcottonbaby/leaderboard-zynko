// pages/api/csdrop-leaderboard.js
export default async function handler(req, res) {
  try {
    // DYNAMIC DATES: Always uses the current 14-day window
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 14);

    const PUBLIC_KEY = 'IJnsemuVsOqzpaLirMzGwhQbcGedfh';
    const PRIVATE_KEY = 'eNpecoKkLYFKfmiEqncYKjFbabhfOh';

    const response = await fetch('https://api.csdrop.com/v1/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Enhanced headers to bypass Cloudflare bot detection
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'x-public-key': PUBLIC_KEY,
        'x-private-key': PRIVATE_KEY,
        'Origin': 'https://www.zynkogambles.com',
        'Referer': 'https://www.zynkogambles.com/'
      },
      body: JSON.stringify({
        type: 'WAGER',
        startTime: Math.floor(startDate.getTime() / 1000),
        endTime: Math.floor(endDate.getTime() / 1000),
        limit: 50
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("CSDrop Error Status:", response.status);
      return res.status(response.status).json({ 
        error: "Security Block", 
        details: "CSDrop/Cloudflare is blocking the server IP." 
      });
    }

    const data = await response.json();
    // Return the specific data structure the frontend expect
    return res.status(200).json({ rankings: data.rankings || data.players || [] });

  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
}