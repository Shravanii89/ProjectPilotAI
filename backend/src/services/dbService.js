const { prisma, isDbConnected } = require('../config/db');
const { AppError } = require('../utils');

/**
 * Reusable Database Service layer using Prisma ORM.
 * Implements CRUD operations for Users, Projects, AnalysisReports, SearchResults, and History.
 */
class DbService {
  // ==========================================
  // 1. USERS CRUD OPERATIONS
  // ==========================================

  /**
   * Create a new user
   */
  static async createUser({ firebaseUid, email, name, avatar, role = 'user' }) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.user.create({
      data: { firebaseUid, email, name, avatar, role },
    });
  }

  /**
   * Get user by database UUID
   */
  static async getUserById(id) {
    if (!prisma) return null;
    return await prisma.user.findUnique({
      where: { id },
      include: { projects: true },
    });
  }

  /**
   * Get user by Firebase UID
   */
  static async getUserByFirebaseUid(firebaseUid) {
    if (!prisma) return null;
    return await prisma.user.findUnique({
      where: { firebaseUid },
    });
  }

  /**
   * Update user details
   */
  static async updateUser(id, data) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user
   */
  static async deleteUser(id) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.user.delete({
      where: { id },
    });
  }

  // ==========================================
  // 2. PROJECTS CRUD OPERATIONS
  // ==========================================

  /**
   * Create a new project
   */
  static async createProject({ userId, title, description, domain, competition = 'medium', documentPath, documentName }) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.project.create({
      data: {
        userId,
        title,
        description,
        domain,
        competition,
        documentPath,
        documentName,
        status: 'pending',
      },
    });
  }

  /**
   * Get project by ID
   */
  static async getProjectById(id) {
    if (!prisma) return null;
    return await prisma.project.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        analysisReports: {
          include: { searchResults: true },
        },
      },
    });
  }

  /**
   * Get all projects for a user with pagination
   */
  static async getProjectsByUserId(userId, { page = 1, limit = 10, search = '' } = {}) {
    if (!prisma) return { items: [], total: 0, page, totalPages: 0 };

    const where = {
      userId,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { domain: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const total = await prisma.project.count({ where });
    const totalPages = Math.ceil(total / limit);
    const items = await prisma.project.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        analysisReports: {
          select: { id: true, overallScore: true, innovationScore: true, createdAt: true },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return { items, total, page, totalPages };
  }

  /**
   * Update project
   */
  static async updateProject(id, data) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.project.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete project
   */
  static async deleteProject(id) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.project.delete({
      where: { id },
    });
  }

  // ==========================================
  // 3. ANALYSIS REPORTS CRUD OPERATIONS
  // ==========================================

  /**
   * Create an analysis report
   */
  static async createReport({
    projectId,
    innovationScore,
    feasibilityScore,
    marketScore,
    overallScore,
    summary,
    patentSummary,
    paperSummary,
    recommendations,
  }) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.analysisReport.create({
      data: {
        projectId,
        innovationScore,
        feasibilityScore,
        marketScore,
        overallScore,
        summary,
        patentSummary,
        paperSummary,
        recommendations,
      },
    });
  }

  /**
   * Get report by ID
   */
  static async getReportById(id) {
    if (!prisma) return null;
    return await prisma.analysisReport.findUnique({
      where: { id },
      include: {
        project: true,
        searchResults: true,
      },
    });
  }

  /**
   * Get all reports for a project
   */
  static async getReportsByProjectId(projectId) {
    if (!prisma) return [];
    return await prisma.analysisReport.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: { searchResults: true },
    });
  }

  /**
   * Update report
   */
  static async updateReport(id, data) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.analysisReport.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete report
   */
  static async deleteReport(id) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.analysisReport.delete({
      where: { id },
    });
  }

  // ==========================================
  // 4. SEARCH RESULTS CRUD OPERATIONS
  // ==========================================

  /**
   * Create a search result entry
   */
  static async createSearchResult({ reportId, source, title, url, relevanceScore, snippet, metadata }) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.searchResult.create({
      data: { reportId, source, title, url, relevanceScore, snippet, metadata },
    });
  }

  /**
   * Get search results for a report
   */
  static async getResultsByReportId(reportId) {
    if (!prisma) return [];
    return await prisma.searchResult.findMany({
      where: { reportId },
      orderBy: { relevanceScore: 'desc' },
    });
  }

  /**
   * Delete a search result
   */
  static async deleteSearchResult(id) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.searchResult.delete({
      where: { id },
    });
  }

  // ==========================================
  // 5. HISTORY CRUD OPERATIONS
  // ==========================================

  /**
   * Create a history action record
   */
  static async createHistoryRecord({ userId, projectId, action, status = 'completed' }) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.history.create({
      data: { userId, projectId, action, status },
    });
  }

  /**
   * Get history for a user
   */
  static async getHistoryByUserId(userId, { page = 1, limit = 10 } = {}) {
    if (!prisma) return { items: [], total: 0, page, totalPages: 0 };

    const where = { userId };
    const total = await prisma.history.count({ where });
    const totalPages = Math.ceil(total / limit);

    const items = await prisma.history.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: { title: true, domain: true, status: true },
        },
      },
    });

    return { items, total, page, totalPages };
  }

  /**
   * Delete a history record
   */
  static async deleteHistoryRecord(id) {
    if (!prisma) throw new AppError('Database client is not initialized.', 500);
    return await prisma.history.delete({
      where: { id },
    });
  }
}

module.exports = DbService;
