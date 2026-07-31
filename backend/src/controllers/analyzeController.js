const { AnalyzeService } = require('../services');
const { catchAsync, sendResponse } = require('../utils');

/**
 * POST /api/analyze
 * Analyze a project idea and fetch related GitHub repositories automatically.
 */
exports.analyzeIdea = catchAsync(async (req, res) => {
  const { title, description, domain, competition, fileId } = req.body;
  const userId = req.user ? req.user.uid : null;
  const email = req.user ? req.user.email : null;

  const report = await AnalyzeService.analyzeIdea({
    title,
    description,
    domain,
    competition,
    fileId,
    userId,
    email,
  });

  sendResponse(res, 200, 'Analysis completed successfully with GitHub repositories.', report);
});
