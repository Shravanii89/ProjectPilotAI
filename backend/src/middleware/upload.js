const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const { AppError } = require('../utils');

// ── Storage configuration ──
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.upload.uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

// ── File filter ──
const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    config.upload.allowedMimeTypes.includes(file.mimetype) &&
    config.upload.allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type. Allowed: ${config.upload.allowedExtensions.join(', ')}`,
        415
      ),
      false
    );
  }
};

// ── Multer instance ──
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

module.exports = upload;
