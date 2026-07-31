const { StartupSearchService } = require('../services');
const { catchAsync, sendResponse } = require('../utils');

/**
 * POST /api/search/startups
 * Startup Intelligence endpoint.
 * Accepts project title & description, returns similar startup products and previous hackathon projects,
 * combining both datasets into one single structured response with similarity scores (0-100) and PostgreSQL caching.
 */
exports.searchStartups = catchAsync(async (req, res) => {
  const { title, description, limit } = req.body;

  const result = await StartupSearchService.searchStartupsAndHackathons({
    title,
    description: description || '',
    limit: limit ? parseInt(limit, 10) : 10,
  });

  sendResponse(res, 200, 'Startup Intelligence search completed successfully.', result);
});
