export default async function handler(req, res) {
  try {
    // Fetch from Kick API or return hardcoded for testing
    const chatroomId = process.env.KICK_CHATROOM_ID || '12345';
    res.status(200).json({ chatroomId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}