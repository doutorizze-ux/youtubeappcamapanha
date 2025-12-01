const prisma = require('../config/db');
const { getYouTubeStats } = require('./youtubeService');
const { getSpotifyStats } = require('./spotifyService');

const validateCampaign = async (campaign) => {
    let currentValue = 0;

    if (campaign.platform === 'youtube') {
        currentValue = await getYouTubeStats(campaign.url);
    } else if (campaign.platform === 'spotify') {
        currentValue = await getSpotifyStats(campaign.url);
    }

    if (currentValue !== null) {
        const status = currentValue >= campaign.targetValue ? 'achieved' : 'pending';

        // Update Campaign
        await prisma.campaign.update({
            where: { id: campaign.id },
            data: {
                currentValue,
                status
            }
        });

        // Add History Record
        await prisma.validationHistory.create({
            data: {
                campaignId: campaign.id,
                value: currentValue
            }
        });

        return { id: campaign.id, currentValue, status };
    }
    return null;
};

const validateAllCampaigns = async () => {
    const campaigns = await prisma.campaign.findMany({
        where: { status: 'pending' } // Only validate pending ones, or all if you want to track progress even after
    });

    const results = [];
    for (const campaign of campaigns) {
        const result = await validateCampaign(campaign);
        if (result) results.push(result);
    }
    return results;
};

module.exports = { validateCampaign, validateAllCampaigns };
