const { UploadService } = require('../services');
const { catchAsync, sendResponse, AppError } = require('../utils');

/**
 * POST /api/upload
 * Upload a document (PDF, DOCX, TXT).
 */
exports.uploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded. Please attach a PDF, DOCX, or TXT file.', 400);
  }

  const fileData = await UploadService.processFile(req.file);

  sendResponse(res, 201, 'File uploaded successfully.', fileData);
});
