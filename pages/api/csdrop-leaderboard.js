// pages/api/csdrop-leaderboard.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const CONFIG = {
    API_URL: "https://api.csdrop.com/v1/leaderboard",
    PUBLIC_KEY: "IJnsemuVsOqzpaLirMzGwhQbcGedfh",
    PRIVATE_KEY: "eNpecoKkLYFKfmiEqncYKjFbabhfOh" 
  };

  const endDateObj = new Date();
  const startDateObj = new Date();
  startDateObj.setDate(endDateObj.getDate() - 14);

  try {
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-public-key': CONFIG.PUBLIC_KEY,
        'x-private-key': CONFIG.PRIVATE_KEY
      },
      body: JSON.stringify({
        type: 'WAGER',
        startTime: Math.floor(startDateObj.getTime() / 1000),
        endTime: Math.floor(endDateObj.getTime() / 1000),
        limit: 50
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from CSDrop" });
  }
}