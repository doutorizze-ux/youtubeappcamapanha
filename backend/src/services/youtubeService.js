const axios = require('axios');

const getYouTubeStats = async (url) => {
    try {
        // Extract Video ID from URL (basic regex)
        const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (!videoId) throw new Error('Invalid YouTube URL');

        const apiKey = process.env.YOUTUBE_API_KEY;
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: 'statistics',
                id: videoId,
                key: apiKey
            }
        });

        if (response.data.items.length === 0) return null;

        const viewCount = response.data.items[0].statistics.viewCount;
        return parseInt(viewCount);
    } catch (error) {
        console.error('Error fetching YouTube stats:', error.message);
        return null;
    }
};

module.exports = { getYouTubeStats };
