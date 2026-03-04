export default async function handler(req, res) {
  const { promotionId } = req.query;
  if (!promotionId) {
    return res.status(400).json({ success: false, error: 'Missing promotionId' });
  }

  try {
    const apiUrl = `https://api.chips.gg/prod/api/public/getPromotionLeaderboard?promotionid=${encodeURIComponent(promotionId)}`;

    // Force fresh fetch: no caching at all
    const chipsRes = await fetch(apiUrl, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      next: { revalidate: 0 }, // for Vercel
    });

    if (!chipsRes.ok) {
      return res.status(chipsRes.status).json({ success: false, error: 'Failed to fetch from Chips.gg' });
    }

    const data = await chipsRes.json();

    // Return directly
    res.setHeader('Cache-Control', 'no-store'); // prevents Vercel edge caching
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Chips API Error:', err);
    return res.status(500).json({ success: false, error: 'Server error fetching Chips.gg data' });
  }
}
