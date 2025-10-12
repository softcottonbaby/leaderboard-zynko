// pages/api/kick/webhook.js
let clients = [];

// Registers an SSE client connection
export function registerClient(res) {
  clients.push(res);
  res.on("close", () => {
    clients = clients.filter((c) => c !== res);
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("✅ Webhook received:", req.body);

    const { type, data } = req.body;

    // Handle chat messages only
    if (type === "chat.message" && data?.user?.username) {
      const message = {
        user: data.user.username,
        text: data.message || "",
      };

      // Send to all connected SSE clients
      clients.forEach((clientRes) => {
        clientRes.write(`data: ${JSON.stringify(message)}\n\n`);
      });
    }

    return res.status(200).json({ ok: true });
  }

  // Anything other than POST gets rejected
  res.status(405).json({ error: "Method not allowed" });
}
