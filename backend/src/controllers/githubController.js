const { GitHubService } = require('../services');
const { catchAsync, sendResponse } = require('../utils');

/**
 * POST /api/search/github
 * GitHub Intelligence module search endpoint.
 * Accepts project title & description, returns top 15 relevant repositories with
 * README content, AI summary, 0-100 relevance score, and PostgreSQL caching.
 */
exports.searchGitHub = catchAsync(async (req, res) => {
  const { title, description, limit } = req.body;

  const result = await GitHubService.searchRepositories({
    title,
    description: description || '',
    limit: limit ? parseInt(limit, 10) : 15,
  });

  sendResponse(res, 200, 'GitHub Intelligence repository search completed successfully.', result);
});
