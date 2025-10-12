// pages/api/kick/callback.js
export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing code");
  }

  // Exchange the code for an access token
  const response = await fetch("https://api.kick.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.KICK_CLIENT_ID,
      client_secret: process.env.KICK_CLIENT_SECRET,
      redirect_uri: "https://zynkogambles.com/api/kick/callback",
      code,
    }),
  });

  const data = await response.json();
  console.log("🔑 OAuth Token response:", data);

  res.send("OAuth callback successful. You can close this window.");
}
