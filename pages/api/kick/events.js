// /pages/api/kick/events.js
import { NextApiRequest, NextApiResponse } from 'next';

let clients = [];

function broadcast(message) {
  clients.forEach((client) => client.write(`data: ${JSON.stringify(message)}\n\n`));
}

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients.push(res);

    req.on('close', () => {
      clients = clients.filter((client) => client !== res);
    });
  } else if (req.method === 'POST') {
    try {
      const { sender, message_id, content } = req.body;

      const chatMessage = {
        user: sender.username,
        text: content,
        messageId: message_id,
      };

      broadcast(chatMessage);

      res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Invalid webhook payload' });
    }
  } else {
    res.status(405).end();
  }
}
