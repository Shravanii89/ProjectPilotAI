const { v4: uuidv4 } = require('uuid');

/**
 * HistoryService – retrieves past analysis records.
 * Currently returns in-memory dummy data; swap for DB queries later.
 */

const dummyHistory = [
  {
    id: uuidv4(),
    title: 'AI-Powered Health Monitor',
    domain: 'Healthcare',
    competition: 'high',
    innovationScore: 87,
    status: 'completed',
    analyzedAt: '2026-07-28T10:30:00Z',
  },
  {
    id: uuidv4(),
    title: 'Smart Campus Navigation',
    domain: 'Education',
    competition: 'medium',
    innovationScore: 74,
    status: 'completed',
    analyzedAt: '2026-07-25T14:15:00Z',
  },
  {
    id: uuidv4(),
    title: 'EcoTrack Carbon Footprint',
    domain: 'Environment',
    competition: 'low',
    innovationScore: 91,
    status: 'completed',
    analyzedAt: '2026-07-22T09:00:00Z',
  },
  {
    id: uuidv4(),
    title: 'FinBot Personal Finance AI',
    domain: 'FinTech',
    competition: 'high',
    innovationScore: 68,
    status: 'completed',
    analyzedAt: '2026-07-20T16:45:00Z',
  },
  {
    id: uuidv4(),
    title: 'AgriSense IoT Platform',
    domain: 'Agriculture',
    competition: 'low',
    innovationScore: 82,
    status: 'completed',
    analyzedAt: '2026-07-18T11:20:00Z',
  },
  {
    id: uuidv4(),
    title: 'Blockchain Supply Chain',
    domain: 'Logistics',
    competition: 'medium',
    innovationScore: 79,
    status: 'in-progress',
    analyzedAt: '2026-07-15T08:30:00Z',
  },
  {
    id: uuidv4(),
    title: 'VR Language Tutor',
    domain: 'EdTech',
    competition: 'medium',
    innovationScore: 85,
    status: 'completed',
    analyzedAt: '2026-07-12T13:00:00Z',
  },
  {
    id: uuidv4(),
    title: 'Drone Delivery Network',
    domain: 'Logistics',
    competition: 'high',
    innovationScore: 72,
    status: 'failed',
    analyzedAt: '2026-07-10T17:30:00Z',
  },
];

class HistoryService {
  /**
   * Retrieve analysis history.
   * @param {{ page?: number, limit?: number, search?: string, status?: string }} query
   * @returns {Promise<{ items: object[], total: number, page: number, totalPages: number }>}
   */
  static async getHistory({ page = 1, limit = 10, search = '', status = '' } = {}) {
    let filtered = [...dummyHistory];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.domain.toLowerCase().includes(q)
      );
    }

    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return { items, total, page, totalPages };
  }
}

module.exports = HistoryService;
