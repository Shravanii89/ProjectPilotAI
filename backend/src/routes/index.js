const { Router } = require('express');
const authRoutes = require('./authRoutes');
const uploadRoutes = require('./uploadRoutes');
const analyzeRoutes = require('./analyzeRoutes');
const historyRoutes = require('./historyRoutes');
const reportRoutes = require('./reportRoutes');
const githubRoutes = require('./githubRoutes');
const paperRoutes = require('./paperRoutes');
const patentRoutes = require('./patentRoutes');
const startupRoutes = require('./startupRoutes');
const similarityRoutes = require('./similarityRoutes');
const systemRoutes = require('./systemRoutes');

const router = Router();

// ── Health check ──
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'ProjectPilot AI API is running.',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// ── Mount feature routers ──
router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/analyze', analyzeRoutes);
router.use('/history', historyRoutes);
router.use('/report', reportRoutes);
router.use('/search', githubRoutes);
router.use('/search', paperRoutes);
router.use('/search', patentRoutes);
router.use('/search', startupRoutes);
router.use('/search', similarityRoutes);
router.use('/system', systemRoutes);

module.exports = router;
