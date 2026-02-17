// pages/api/csdrop-leaderboard.js
export default async function handler(req, res) {
  try {
    const PUBLIC_KEY = 'IJnsemuVsOqzpaLirMzGwhQbcGedfh';
    const PRIVATE_KEY = 'eNpecoKkLYFKfmiEqncYKjFbabhfOh';

    // 1. DYNAMIC DATES: 14-day window
    const endTimestamp = Math.floor(Date.now() / 1000);
    const startTimestamp = endTimestamp - (14 * 24 * 60 * 60);

    // 2. CONSTRUCT URL: Based on /api/v1/race/affiliates/{publicKey}
    const url = new URL(`https://api.csdrop.com/api/v1/race/affiliates/${PUBLIC_KEY}`);
    url.searchParams.append('start_timestamp', startTimestamp);
    url.searchParams.append('end_timestamp', endTimestamp);

    const response = await fetch(url.toString(), {
      method: 'GET', // Documentation says GET
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'X-Private-Key': PRIVATE_KEY, // Documentation specifies X-Private-Key
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("CSDrop API Error Status:", response.status, errorData);
      return res.status(response.status).json({ 
        error: "Security Block or Invalid Request", 
        details: errorData 
      });
    }

    const data = await response.json();
    
    // 3. MAP DATA: Documentation says the array is under 'ranking'
    const rankings = data.ranking || [];
    
    return res.status(200).json({ rankings });

  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
}