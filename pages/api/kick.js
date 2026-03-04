// This is a backend API route.
// Its job is to find the public chatroom ID for the channel.
export default async function handler(req, res) {
    try {
        const channelName = 'zynkogambles';
        // We fetch the Kick API from our backend
        const response = await fetch(`https://kick.com/api/v2/channels/${channelName}`);
        
        if (!response.ok) {
            console.error('Kick API fetch failed:', response.status);
            throw new Error('Failed to fetch channel data');
        }
        
        const data = await response.json();
        
        if (!data.chatroom || !data.chatroom.id) {
            console.error('Chatroom ID not found in response:', data);
            throw new Error('Chatroom ID not found in API response');
        }

        const chatroomId = data.chatroom.id;
        
        // Send the chatroom ID back to the frontend (picker.js)
        res.status(200).json({ chatroomId: chatroomId });

    } catch (error) {
        console.error('Error in /api/kick:', error.message);
        res.status(500).json({ error: error.message });
    }
}

