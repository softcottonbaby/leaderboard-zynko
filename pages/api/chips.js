// /pages/api/chips.js
export default async function handler(req, res) {
  try {
    // ✅ Promotion ID (without the "promotion:" prefix in query)
    const rawId = req.query.promotionId || "99SRVGQMNQ1BRD10R7DLTU";
    const promotionId = rawId.startsWith("promotion:")
      ? rawId
      : `promotion:${rawId}`;

    // ✅ Main Chips.gg endpoint
    const url = `https://api.chips.gg/prod/api/public/getPromotionLeaderboard?promotionid=${promotionId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Origin: "https://chips.gg",
        Referer: "https://chips.gg/",
      },
    });

    const text = await response.text();

    // ⚙️ Try to parse Chips.gg response
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Invalid JSON from Chips.gg:", text.slice(0, 300));
      return res.status(502).json({
        success: false,
        error: "Invalid JSON response from Chips.gg",
        raw: text,
      });
    }

    // 🧩 Handle invalid responses
    if (!data || data.error || data.message?.includes("not found")) {
      console.warn("⚠️ Chips.gg returned no leaderboard:", data);
      return res.status(404).json({
        success: false,
        error: `No leaderboard found for ${promotionId}`,
        raw: data,
      });
    }

    // 🧠 Extract leaderboard array
    const leaderboard =
      data?.data?.leaderboard ||
      data?.leaderboard ||
      data?.data ||
      [];

    // ✅ Return formatted leaderboard
    return res.status(200).json({
      success: true,
      data: {
        leaderboard,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching Chips.gg leaderboard:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
