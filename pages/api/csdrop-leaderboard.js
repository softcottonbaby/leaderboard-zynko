// pages/api/csdrop-leaderboard.js
export default async function handler(req, res) {
  try {
    // Dynamic dates: 14 days ago to Right Now
    const endDate = new Date(); 
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 14);

    const PUBLIC_KEY = 'IJnsemuVsOqzpaLirMzGwhQbcGedfh';
    const PRIVATE_KEY = 'eNpecoKkLYFKfmiEqncYKjFbabhfOh';

    const response = await fetch('https://api.csdrop.com/v1/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0', // Helps bypass basic bot protection
        'x-public-key': PUBLIC_KEY,
        'x-private-key': PRIVATE_KEY
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
      return res.status(response.status).json({ error: "CSDrop rejected request", details: errorData });
    }

    const data = await response.json();
    const rankings = data.rankings || data.players || [];
    
    // Return the specific data structure your frontend expects
    return res.status(200).json({ rankings: rankings });

  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
}