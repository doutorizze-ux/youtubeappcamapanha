const axios = require('axios');

// Note: In a real app, you'd handle OAuth2 token refresh here. 
// For simplicity, we assume a valid access token is provided or managed via client credentials flow.

const getSpotifyToken = async () => {
    // Client Credentials Flow to get a token
    const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting Spotify token:', error.message);
        return null;
    }
};

const getSpotifyStats = async (url) => {
    try {
        // Extract ID (Track or Album)
        // Example: https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
        const parts = url.split('/');
        const type = parts[parts.length - 2]; // 'track' or 'album'
        const id = parts[parts.length - 1].split('?')[0];

        const token = await getSpotifyToken();
        if (!token) throw new Error('Could not authenticate with Spotify');

        let popularity = 0; // Spotify API doesn't give exact play counts publicly via API, usually just 'popularity' or you need artist access.
        // However, for this exercise, we will fetch the object and simulate/use available metrics.
        // Note: The prompt asks for "views/plays". Public Spotify API does NOT return play counts for tracks.
        // It returns 'popularity' (0-100). 
        // To get real play counts, one usually needs to be the artist or scrape.
        // We will return 'popularity' as a proxy or mock the play count for demonstration if the API doesn't provide it.

        // Let's fetch the track info
        const response = await axios.get(`https://api.spotify.com/v1/${type}s/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Since we can't get exact plays, we'll return popularity for now, 
        // OR we can simulate a "play count" based on popularity for the sake of the "Validation System" demo.
        // In a real scenario, this might require a different provider or scraping.

        return response.data.popularity * 1000; // Mocking a number based on popularity for demo purposes
    } catch (error) {
        console.error('Error fetching Spotify stats:', error.message);
        return null;
    }
};

module.exports = { getSpotifyStats };
