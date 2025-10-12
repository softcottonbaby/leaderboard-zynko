// pages/api/kick/webhook.js
import { broadcastToClients } from "./events";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const event = req.body;

  console.log("📩 Webhook event received:", event?.type || "unknown");

  try {
    // Adjust according to Kick's actual JSON structure
    if (event?.type?.includes("chat")) {
      const user =
        event?.data?.user?.username ||
        event?.data?.sender?.username ||
        event?.data?.display_name ||
        "unknown";
      const text =
        event?.data?.message ||
        event?.data?.content ||
        event?.data?.text ||
        "";

      if (user && text) {
        broadcastToClients({ user, text });
      }
    }
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
  }

  res.status(200).json({ ok: true });
}
