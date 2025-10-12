// pages/api/kick/events.js
import { registerClient } from "./webhook";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write(":ok\n\n");

  registerClient(res);
}
