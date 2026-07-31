const { Router } = require('express');
const { systemController } = require('../controllers');
const { optionalAuth } = require('../middleware');

const router = Router();

/**
 * GET /api/system/health
 * Lightweight health check endpoint
 */
router.get('/health', systemController.getHealth);

/**
 * GET /api/system/full-test
 * End-to-End diagnostic test runner for all 12 modules
 */
router.get('/full-test', optionalAuth, systemController.runFullTest);

/**
 * POST /api/system/test-error
 * Error handling simulator test bench
 */
router.post('/test-error', optionalAuth, systemController.testErrorScenario);

module.exports = router;
