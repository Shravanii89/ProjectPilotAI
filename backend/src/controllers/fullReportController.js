const { ReportGeneratorService } = require('../services');
const { catchAsync, sendResponse } = require('../utils');

/**
 * POST /api/analyze/full-report
 * Final Report Generator endpoint.
 * Combines GitHub, Papers, Patents, Startups, Vector Similarity Engine, Gemini 2.5 Flash, and Innovation DNA into a unified 14-section report in JSON and Markdown format.
 */
exports.generateFullReport = catchAsync(async (req, res) => {
  const { title, description, domain, competition } = req.body;
  const userId = req.user?.uid;
  const email = req.user?.email;

  const result = await ReportGeneratorService.generateFullReport({
    title,
    description: description || '',
    domain: domain || 'General Software',
    competition: competition || 'medium',
    userId,
    email,
  });

  sendResponse(res, 200, 'Full Innovation Validation Report generated successfully.', result);
});
