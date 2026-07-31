const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const config = require('./config');
const apiRoutes = require('./routes');
const { errorHandler } = require('./middleware');
const { AppError } = require('./utils');

// ── Create Express app ──
const app = express();

// ── Security headers ──
app.use(helmet());

// ── CORS ──
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Request logging ──
if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── Body parsers ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Serve uploaded files (development only) ──
if (config.isDev) {
  app.use(
    '/uploads',
    express.static(path.resolve(__dirname, '../uploads'))
  );
}

// ── API routes ──
app.use(config.api.prefix, apiRoutes);

// ── Root endpoint ──
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ProjectPilot AI API',
    version: '1.0.0',
    docs: `${config.api.prefix}/health`,
  });
});

// ── 404 handler ──
app.all('{*path}', (req, _res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found.`, 404));
});

// ── Centralised error handler (must be last) ──
app.use(errorHandler);

module.exports = app;
