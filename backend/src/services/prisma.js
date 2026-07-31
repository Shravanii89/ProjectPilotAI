const { prisma, connectDB, disconnectDB, isDbConnected } = require('../config/db');

/**
 * Prisma Client export service module.
 * Provides direct access to the initialized PrismaClient instance.
 */
module.exports = {
  prisma,
  connectDB,
  disconnectDB,
  isDbConnected,
};
