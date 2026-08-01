const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',

  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/projectpilot_db?schema=public',

  cors: {
    // Support comma-separated origins; always include localhost for dev
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000',
    credentials: true,
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB
    uploadDir: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    allowedExtensions: ['.pdf', '.docx', '.txt'],
  },

  api: {
    prefix: '/api',
  },
};

module.exports = config;
