const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
// Middleware for auth would go here
// const auth = require('../middleware/auth');

router.post('/', campaignController.createCampaign);
router.get('/', campaignController.getCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.post('/:id/validate', campaignController.manualValidate);
router.delete('/:id', campaignController.deleteCampaign);

module.exports = router;
