const { SystemTestService } = require('../services');
const { catchAsync, sendResponse } = require('../utils');

/**
 * GET /api/system/health
 * Lightweight system health status
 */
exports.getHealth = catchAsync(async (_req, res) => {
  const result = await SystemTestService.getSystemHealth();
  sendResponse(res, 200, 'System health status retrieved successfully.', result);
});

/**
 * GET /api/system/full-test
 * End-to-End diagnostic test runner for all 12 modules
 */
exports.runFullTest = catchAsync(async (_req, res) => {
  const result = await SystemTestService.runFullDiagnostics();
  sendResponse(res, 200, 'Full system diagnostics completed successfully.', result);
});

/**
 * POST /api/system/test-error
 * Interactive error handling simulator bench
 */
exports.testErrorScenario = catchAsync(async (req, res) => {
  const { type } = req.body;
  const result = await SystemTestService.simulateErrorTest(type);
  sendResponse(res, 200, `Error scenario test "${type}" completed successfully.`, result);
});
