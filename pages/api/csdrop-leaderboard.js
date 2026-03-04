// pages/api/csdrop-leaderboard.js
export default async function handler(req, res) {
  try {
    const PUBLIC_KEY = 'IJnsemuVsOqzpaLirMzGwhQbcGedfh';
    const PRIVATE_KEY = 'eNpecoKkLYFKfmiEqncYKjFbabhfOh';

    const endTimestamp = Math.floor(Date.now() / 1000);
    const startTimestamp = endTimestamp - (14 * 24 * 60 * 60);

    // Endpoint from documentation: /api/v1/race/affiliates/{publicKey}
    const url = `https://api.csdrop.com/api/v1/race/affiliates/${PUBLIC_KEY}?start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Private-Key': PRIVATE_KEY, // Documentation requirement
        'User-Agent': 'Mozilla/5.0'
      },
    });

    const data = await response.json();
    // Return the "ranking" array as specified in the docs
    return res.status(200).json({ rankings: data.ranking || [] });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}