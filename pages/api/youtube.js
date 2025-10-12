export default async function handler(req, res) {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = 'UC3KcZjlAVHnDbw6awqaepPg';

    // 1) Get the uploads playlist ID
    const uploadsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    const uploadsData = await uploadsRes.json();

    const uploadPlaylistId =
      uploadsData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadPlaylistId) {
      return res.status(500).json({ error: 'Upload playlist not found.' });
    }

    // 2) Get videos from that playlist
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadPlaylistId}&maxResults=6&key=${API_KEY}`
    );
    const videosData = await videosRes.json();

    res.status(200).json(videosData.items || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
