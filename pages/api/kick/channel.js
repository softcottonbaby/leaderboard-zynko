// pages/api/kick/channel.js
export default async function handler(req, res) {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'username required' });

    const endpoints = [
        `https://kick.com/api/v2/channels/${username}`,
        `https://kick.com/api/v1/channels/${username}`,
    ];

    for (const url of endpoints) {
        try {
            const kickRes = await fetch(url, {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Referer': 'https://kick.com/',
                    'Origin': 'https://kick.com',
                },
                signal: AbortSignal.timeout(8000),
            });

            if (!kickRes.ok) { 
                console.warn(`Kick API ${url} returned ${kickRes.status}`); 
                continue; 
            }

            const data = await kickRes.json();

            // FIXED: Check multiple possible avatar field names that Kick uses
            const avatar = 
                data.user?.profilepic ||           // Most common in v2
                data.user?.profile_picture ||      // Alternative naming
                data.user?.profile_image ||        // Another variant
                data.user?.avatar ||               // Generic fallback
                data.profilepic ||                 // Direct on data
                data.profile_picture ||
                data.profile_image ||
                data.avatar ||
                null;

            // FIXED: Also check for chatroom ID in multiple locations
            const chatroomId = 
                data.chatroom?.id || 
                data.chatroom_id || 
                data.id ||  // Sometimes the channel ID is used
                null;

            return res.status(200).json({
                avatar,
                username: data.user?.username || data.slug || username,
                viewerCount: data.livestream?.viewer_count || data.viewer_count || 0,
                isLive: !!data.livestream || data.is_live || false,
                chatroomId,
            });

        } catch (err) {
            console.error(`Kick proxy error for ${url}:`, err.message);
        }
    }

    // Graceful fallback — never crash the picker
    return res.status(200).json({ 
        avatar: null, 
        username, 
        viewerCount: 0, 
        isLive: false, 
        chatroomId: null, 
        error: 'Kick API unavailable' 
    });
}