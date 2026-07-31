const { Router } = require('express');
const { patentController } = require('../controllers');
const { patentSearchValidation, authenticateToken } = require('../middleware');

const router = Router();

/**
 * POST /api/search/patents
 * Protected endpoint for Patent Intelligence search.
 */
router.post('/patents', authenticateToken, patentSearchValidation, patentController.searchPatents);

module.exports = router;
