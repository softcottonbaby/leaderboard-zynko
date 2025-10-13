// /pages/api/chips.js

export default async function handler(req, res) {
  try {
    // 🟦 Required Chips.gg promotion ID
    const promotionId = req.query.promotionId || "99SRVGQMNQ1BRD10R7DLTU";

    // 🔹 Correct Chips.gg endpoint — note the "promotion:" prefix!
    const apiUrl = `https://api.chips.gg/prod/api/public/getPromotionLeaderboard?promotionid=promotion:${promotionId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Origin: "https://chips.gg",
        Referer: "https://chips.gg/",
      },
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);

      if (!data || !data.data) {
        console.error("⚠️ CHIPS.GG returned empty or error data:", data);
        return res.status(502).json({
          success: false,
          error: "No data or invalid response",
          raw: data,
        });
      }

      return res.status(200).json({
        success: true,
        data: data.data,
      });
    } catch (parseErr) {
      console.error("⚠️ Invalid JSON from CHIPS.GG:", text.slice(0, 300));
      return res
        .status(502)
        .json({ success: false, error: "Invalid JSON response", raw: text });
    }
  } catch (error) {
    console.error("❌ Error fetching CHIPS.GG leaderboard:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
