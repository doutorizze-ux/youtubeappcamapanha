const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const { validateAllCampaigns } = require('./services/validationService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('New Music API is running');
});

// Automation: Run validation every 12 hours
cron.schedule('0 */12 * * *', async () => {
    console.log('Running automatic campaign validation...');
    await validateAllCampaigns();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
