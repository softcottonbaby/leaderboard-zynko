// pages/api/csgold.js
export default async function handler(req, res) {
  try {
    console.log('✅ /api/csgold route called');

    const endDate = new Date('2025-08-24T23:59:59Z');
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 7);

    const response = await fetch('https://api.csgold.gg/affiliate/leaderboard/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'b31e5dd59bfbcb166f54b07ca47bcc8a9c92069302de1a0b874ba3899e09fba0',
        type: 'WAGER',
        before: endDate.getTime(),
        after: startDate.getTime(),
      }),
    });

    // Log the response headers and status
    console.log('🟢 CSGold API status:', response.status, response.statusText);

    // Try to read as text first
    const text = await response.text();

    try {
      const data = JSON.parse(text);
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
