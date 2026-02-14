export default async function handler(req, res) {
  try {
    // --- CONFIGURATION ---
    // Ensure these dates match the current active race on CSDrop
    const endDate = new Date('2026-02-28T23:59:59Z'); 
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 14); // 14 Day window

    // --- KEYS ---
    // I have trimmed them to ensure no accidental spaces exist
    const PUBLIC_KEY = 'IJnsemuVsOqzpaLirMzGwhQbcGedfh'.trim();
    const PRIVATE_KEY = 'eNpecoKkLYFKfmiEqncYKjFbabhfOh'.trim();

    console.log("Fetching CSDrop data..."); // Debug log

    const response = await fetch('https://api.csdrop.com/v1/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // --- FIX 1: Add User-Agent to look like a real browser (Fixes 403 Cloudflare) ---
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        // --- KEYS ---
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

    // --- FIX 2: Better Error Debugging ---
    if (!response.ok) {
      const errorText = await response.text(); // Read the actual error message from CSDrop
      console.error(`CSDrop API Error Details:`, errorText);
      throw new Error(`CSDrop API responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Cache for 60 seconds
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    // Handle data structure safely
    const rankings = data.rankings || data.players || [];
    
    return res.status(200).json({ success: true, data: rankings });

  } catch (error) {
    console.error("CSDrop Proxy Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}