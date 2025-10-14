// kickWebhookSetup.js
// Usage: node kickWebhookSetup.js
// Requires: npm install node-fetch prompt-sync

import fetch from "node-fetch";
import prompt from "prompt-sync";

const CLIENT_ID = "01K7CWNP8KYNV16KKR1YMJ6W4Z";
const CLIENT_SECRET = "d889fc984fdcb15c96272ff823efca08f62a373706101c1241995ad75ebb51c7";
const REDIRECT_URI = "https://zynkogambles.com/api/kick/callback";
const WEBHOOK_URL = "https://zynkogambles.com/api/kick/webhook";

const ask = prompt({ sigint: true });

async function main() {
  console.log("\n=== Kick Webhook Quick-Setup ===\n");

  console.log("1️⃣  Open this URL in your browser and log in to Kick:\n");
  console.log(
    `https://kick.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&scope=read_user+subscribe_events\n`
  );

  const authCode = ask("Paste the ?code= value from the redirected URL: ").trim();

  console.log("\n2️⃣  Exchanging code for access token…");
  const tokenRes = await fetch("https://api.kick.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code: authCode,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error("❌ Token request failed:", tokenData);
    return;
  }

  const accessToken = tokenData.access_token;
  console.log("✅ Got access token.");

  console.log("\n3️⃣  Subscribing webhook to chat.message events…");
  const subRes = await fetch("https://api.kick.com/api/v1/webhooks/subscribe", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event: "chat.message",
      callback_url: WEBHOOK_URL,
    }),
  });

  const subData = await subRes.json();
  if (!subRes.ok) {
    console.error("❌ Subscription failed:", subData);
    return;
  }
  console.log("✅ Webhook subscribed:", subData);

  console.log("\n4️⃣  Listing registered webhooks…");
  const listRes = await fetch("https://api.kick.com/api/v1/webhooks", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const listData = await listRes.json();
  console.log("📋 Current webhooks:\n", JSON.stringify(listData, null, 2));

  console.log("\n🎉 Done! Kick will now POST chat messages to:", WEBHOOK_URL);
}

main().catch((err) => console.error("Unexpected error:", err));
