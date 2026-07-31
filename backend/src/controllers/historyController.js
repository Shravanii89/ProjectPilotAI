const { HistoryService } = require('../services');
const { catchAsync, sendResponse } = require('../utils');

/**
 * GET /api/history
 * Retrieve paginated analysis history.
 * Query params: page, limit, search, status
 */
exports.getHistory = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search = '', status = '' } = req.query;

  const result = await HistoryService.getHistory({
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    search,
    status,
  });

  sendResponse(res, 200, 'History retrieved successfully.', result.items, {
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
  });
});
