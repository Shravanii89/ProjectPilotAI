const { Router } = require('express');
const { startupController } = require('../controllers');
const { startupSearchValidation, authenticateToken } = require('../middleware');

const router = Router();

/**
 * POST /api/search/startups
 * Protected endpoint for Startup Intelligence search.
 */
router.post('/startups', authenticateToken, startupSearchValidation, startupController.searchStartups);

module.exports = router;
