const { Router } = require('express');
const { githubController } = require('../controllers');
const { githubSearchValidation, authenticateToken } = require('../middleware');

const router = Router();

/**
 * POST /api/search/github
 * Protected endpoint for GitHub repository search.
 */
router.post('/github', authenticateToken, githubSearchValidation, githubController.searchGitHub);

module.exports = router;
