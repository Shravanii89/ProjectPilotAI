const { PatentService } = require('../services');
const { catchAsync, sendResponse } = require('../utils');

/**
 * POST /api/search/patents
 * Patent Intelligence endpoint.
 * Accepts project title & description, returns relevant patents from PatentsView / USPTO API,
 * including patent title, number, inventor, publication date, assignee, abstract, patent link,
 * AI summary, similarity score (0-100), and PostgreSQL caching.
 */
exports.searchPatents = catchAsync(async (req, res) => {
  const { title, description, limit } = req.body;

  const result = await PatentService.searchPatents({
    title,
    description: description || '',
    limit: limit ? parseInt(limit, 10) : 10,
  });

  sendResponse(res, 200, 'Patent Intelligence search completed successfully.', result);
});
