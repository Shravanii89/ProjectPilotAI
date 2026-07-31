const { Router } = require('express');
const { historyController } = require('../controllers');
const { authenticateToken } = require('../middleware');

const router = Router();

/**
 * GET /api/history
 * Retrieve analysis history. Protected route.
 */
router.get('/', authenticateToken, historyController.getHistory);

module.exports = router;
