const { Router } = require('express');
const { paperController } = require('../controllers');
const { paperSearchValidation, authenticateToken } = require('../middleware');

const router = Router();

/**
 * POST /api/search/papers
 * Protected endpoint for Research Intelligence paper search.
 */
router.post('/papers', authenticateToken, paperSearchValidation, paperController.searchPapers);

module.exports = router;
