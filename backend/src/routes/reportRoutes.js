const { Router } = require('express');
const { reportController } = require('../controllers');
const { reportIdValidation, optionalAuth } = require('../middleware');

const router = Router();

/**
 * GET /api/report/:id
 * Retrieve a full analysis report by ID.
 */
router.get('/:id', optionalAuth, reportIdValidation, reportController.getReport);

/**
 * GET /api/report/:id/pdf
 * Download professional PDF Innovation Validation Report.
 */
router.get('/:id/pdf', optionalAuth, reportIdValidation, reportController.exportPdf);

/**
 * GET /api/report/:id/ppt
 * Download 10-Slide Startup Pitch Deck (.pptx).
 */
router.get('/:id/ppt', optionalAuth, reportIdValidation, reportController.exportPpt);

module.exports = router;
