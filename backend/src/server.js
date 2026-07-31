const app = require('./app');
const config = require('./config');

// ── Handle uncaught exceptions ──
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// ── Start server ──
const server = app.listen(config.port, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║                                                  ║
  ║   🚀  ProjectPilot AI API Server                 ║
  ║                                                  ║
  ║   Environment : ${config.nodeEnv.padEnd(30)}║
  ║   Port        : ${String(config.port).padEnd(30)}║
  ║   CORS Origin : ${config.cors.origin.padEnd(30)}║
  ║                                                  ║
  ║   Local  : http://localhost:${config.port}/api/health   ║
  ║                                                  ║
  ╚══════════════════════════════════════════════════╝
  `);
});

// ── Handle unhandled promise rejections ──
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// ── Graceful shutdown ──
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated.');
  });
});
