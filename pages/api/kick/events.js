// pages/api/kick/events.js
let clients = [];

export function broadcastToClients(payload) {
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  clients.forEach((res) => {
    try {
      res.write(data);
    } catch (err) {
      // ignore disconnected clients
    }
  });
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  res.write(":ok\n\n");

  clients.push(res);
  console.log("🟢 Client connected:", clients.length);

  req.on("close", () => {
    clients = clients.filter((c) => c !== res);
    console.log("🔴 Client disconnected:", clients.length);
  });
}
