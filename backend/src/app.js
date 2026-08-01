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

// ── Parse allowed CORS origins ──
const allowedOrigins = config.cors.origin
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

console.log('[CORS] Allowed origins:', allowedOrigins);

// ── CORS configuration ──
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      // Return false instead of Error — still blocks but doesn't crash the response
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// ── 1. CORS must come FIRST — before helmet and everything else ──
app.use(cors(corsOptions));

// ── 2. Handle preflight OPTIONS requests explicitly ──
app.options('*', cors(corsOptions));

// ── 3. Security headers — configured to NOT interfere with CORS ──
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'unsafe-none' },
    crossOriginEmbedderPolicy: false,
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
