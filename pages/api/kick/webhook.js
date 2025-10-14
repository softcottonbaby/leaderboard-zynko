let clients = [];

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

    if (type === "chat.message" && data?.user?.username) {
      const message = {
        user: data.user.username,
        text: data.message || "",
      };

      clients.forEach((clientRes) => {
        clientRes.write(`data: ${JSON.stringify(message)}\n\n`);
      });
    }

    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
