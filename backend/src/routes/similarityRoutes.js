const { Router } = require('express');
const { similarityController } = require('../controllers');
const { similaritySearchValidation, authenticateToken } = require('../middleware');

const router = Router();

/**
 * POST /api/search/similarity
 * Protected endpoint for AI Similarity Engine (sentence-transformers cosine similarity).
 */
router.post('/similarity', authenticateToken, similaritySearchValidation, similarityController.computeSimilarity);

module.exports = router;
