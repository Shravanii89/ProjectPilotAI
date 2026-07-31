const { Router } = require('express');
const { analyzeController, geminiController, dnaController, fullReportController } = require('../controllers');
const { analyzeValidation, authenticateToken } = require('../middleware');

const router = Router();

/**
 * POST /api/analyze
 * Submit an idea for analysis. Protected route.
 */
router.post('/', authenticateToken, analyzeValidation, analyzeController.analyzeIdea);

/**
 * POST /api/analyze/gemini
 * Run Google Gemini 2.5 Flash analysis across all intelligence modules.
 */
router.post('/gemini', authenticateToken, analyzeValidation, geminiController.analyzeWithGemini);

/**
 * POST /api/analyze/dna
 * Run Innovation DNA Engine evaluation (8 core metrics + Radar Chart JSON + Weak/Strong Areas).
 */
router.post('/dna', authenticateToken, analyzeValidation, dnaController.calculateDna);

/**
 * POST /api/analyze/full-report
 * Final Report Generator endpoint combining all 6 intelligence modules (JSON + Markdown).
 */
router.post('/full-report', authenticateToken, analyzeValidation, fullReportController.generateFullReport);

module.exports = router;
