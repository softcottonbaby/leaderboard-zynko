export default async function handler(req, res) {
  const { username } = req.query;
  
  try {
    const response = await fetch(`https://kick.com/api/v2/channels/${username}`);
    const data = await response.json();
    const avatarUrl = data.user?.profilepic || data.user?.profile_picture;
    
    if (avatarUrl) {
      // Redirect to the actual image
      res.redirect(307, avatarUrl.startsWith('//') ? 'https:' + avatarUrl : avatarUrl);
    } else {
      res.status(404).json({ error: 'No avatar found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
}