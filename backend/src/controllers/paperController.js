const { PaperService } = require('../services');
const { catchAsync, sendResponse } = require('../utils');

/**
 * POST /api/search/papers
 * Research Intelligence module endpoint.
 * Accepts project title & description, returns top 10 most relevant research papers from Semantic Scholar,
 * including authors, year, abstract, citation count, DOI, pdfUrl, venue, AI paper summary, relevance score,
 * research gap, and PostgreSQL caching.
 */
exports.searchPapers = catchAsync(async (req, res) => {
  const { title, description, limit } = req.body;

  const result = await PaperService.searchPapers({
    title,
    description: description || '',
    limit: limit ? parseInt(limit, 10) : 10,
  });

  sendResponse(res, 200, 'Research Intelligence paper search completed successfully.', result);
});
