/**
 * UploadService – handles file processing after Multer saves the file.
 * Currently returns metadata only; add text extraction / OCR later.
 */
class UploadService {
  /**
   * Process an uploaded file.
   * @param {import('multer').File} file - Multer file object
   * @returns {Promise<object>} file metadata
   */
  static async processFile(file) {
    // TODO: Extract text from PDF/DOCX, run OCR, etc.
    return {
      id: file.filename.split('.')[0],
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedAt: new Date().toISOString(),
    };
  }
}

module.exports = UploadService;
