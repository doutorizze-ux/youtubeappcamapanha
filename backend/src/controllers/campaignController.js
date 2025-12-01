const prisma = require('../config/db');
const { validateCampaign } = require('../services/validationService');

exports.createCampaign = async (req, res) => {
    try {
        const { name, platform, url, targetValue, provider, startDate, endDate, userId } = req.body;
        const campaign = await prisma.campaign.create({
            data: {
                name,
                platform,
                url,
                targetValue: parseInt(targetValue),
                provider,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                userId: userId || 1 // Default to 1 for demo if no auth context yet
            }
        });
        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCampaigns = async (req, res) => {
    try {
        const campaigns = await prisma.campaign.findMany({
            include: { validations: true }
        });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await prisma.campaign.findUnique({
            where: { id: parseInt(id) },
            include: { validations: true }
        });
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.manualValidate = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await prisma.campaign.findUnique({ where: { id: parseInt(id) } });
        if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

        const result = await validateCampaign(campaign);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
