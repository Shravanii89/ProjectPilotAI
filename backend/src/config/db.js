const { PrismaClient } = require('@prisma/client');
const config = require('./index');

/**
 * Prisma Client initialization with logging and error safety.
 */
let prisma = null;
let isDbConnected = false;

try {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: config.databaseUrl,
      },
    },
    log: config.isDev ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
} catch (err) {
  console.warn('[Prisma] Failed to initialize PrismaClient:', err.message);
}

/**
 * Connect to PostgreSQL database with test query
 */
const connectDB = async () => {
  if (!prisma) return false;
  try {
    await prisma.$connect();
    isDbConnected = true;
    console.log('✅ Connected to PostgreSQL database via Prisma.');
    return true;
  } catch (error) {
    isDbConnected = false;
    console.warn(`⚠️  PostgreSQL connection warning: ${error.message}`);
    console.warn('⚠️  Database queries will fallback to in-memory mode if DB is unreachable.');
    return false;
  }
};

/**
 * Graceful disconnect from database
 */
const disconnectDB = async () => {
  if (prisma && isDbConnected) {
    await prisma.$disconnect();
    isDbConnected = false;
    console.log('✅ PostgreSQL database disconnected cleanly.');
  }
};

module.exports = {
  prisma,
  connectDB,
  disconnectDB,
  isDbConnected: () => isDbConnected,
};
