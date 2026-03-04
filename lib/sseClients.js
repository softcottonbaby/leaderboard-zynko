// lib/sseClients.js
let clients = [];

export function registerClient(res) {
  clients.push(res);
  res.on("close", () => {
    clients = clients.filter((c) => c !== res);
  });
}

export function broadcast(data) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach((c) => c.write(msg));
}

export function getClientCount() {
  return clients.length;
}
