// pages/api/csgold.js
export default async function handler(req, res) {
  try {
    console.log('✅ /api/csgold route called');

    // --- CORRECTED DATES ---
    // This should match the end date in leaderboard.js
    const endDate = new Date('2025-11-09T23:59:59Z'); 
    
    // This should be the start of your *bi-weekly* period.
    // Let's set it to 14 days before the end date.
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 14); // 14 days for bi-weekly
    // --- END OF CORRECTION ---

    const response = await fetch('https://api.csgold.gg/affiliate/leaderboard/referrals', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      body: JSON.stringify({
        key: 'b31e5dd59bfbcb166f54b07ca47bcc8a9c92069302de1a0b874ba3899e09fba0',
        type: 'WAGER',
        // --- USE THE CORRECTED DATES ---
        before: endDate.getTime(),
        after: startDate.getTime(),
        // --- END OF CORRECTION ---
      }),
      next: { revalidate: 0 }, 
    });

    // Log the response headers and status
    console.log('🟢 CSGold API status:', response.status, response.statusText);

    // Try to read as text first
    const text = await response.text();

    try {
      const data = JSON.parse(text);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(data);
    } catch (jsonErr) {
      console.error('❌ API did not return JSON. Response text:', text.slice(0, 200));
      return res.status(500).json({ success: false, error: 'Invalid JSON from CSGold API' });
    }
  } catch (error) {
    console.error('🔥 Error in /api/csgold:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}