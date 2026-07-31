import { auth } from './firebase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to construct headers with Firebase Auth ID token
 */
async function getAuthHeaders(extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('[API Service] Token fetch warning:', err.message);
  }

  return headers;
}

/**
 * Common fetch wrapper handling status codes & error messages
 */
async function fetchApi(endpoint, options = {}) {
  const headers = await getAuthHeaders(options.headers || {});
  const url = `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || `API request failed with status ${res.status}`);
    }
    return json.data !== undefined ? json.data : json;
  }

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  return res;
}

export const apiService = {
  // ── GitHub Intelligence ──
  searchGitHub: (payload) => fetchApi('/search/github', { method: 'POST', body: JSON.stringify(payload) }),

  // ── Research Papers ──
  searchPapers: (payload) => fetchApi('/search/papers', { method: 'POST', body: JSON.stringify(payload) }),

  // ── Patents Search ──
  searchPatents: (payload) => fetchApi('/search/patents', { method: 'POST', body: JSON.stringify(payload) }),

  // ── Startup & Hackathons Search ──
  searchStartups: (payload) => fetchApi('/search/startups', { method: 'POST', body: JSON.stringify(payload) }),

  // ── Vector Similarity Engine ──
  computeSimilarity: (payload) => fetchApi('/search/similarity', { method: 'POST', body: JSON.stringify(payload) }),

  // ── Innovation DNA Engine ──
  calculateDna: (payload) => fetchApi('/analyze/dna', { method: 'POST', body: JSON.stringify(payload) }),

  // ── Gemini 2.5 Flash Analysis ──
  analyzeGemini: (payload) => fetchApi('/analyze/gemini', { method: 'POST', body: JSON.stringify(payload) }),

  // ── Unified Full Report Generator ──
  generateFullReport: (payload) => fetchApi('/analyze/full-report', { method: 'POST', body: JSON.stringify(payload) }),

  // ── System Health & Testing ──
  getSystemHealth: () => fetchApi('/system/health'),
  runFullSystemDiagnostics: () => fetchApi('/system/full-test'),
  simulateErrorTest: (type) => fetchApi('/system/test-error', { method: 'POST', body: JSON.stringify({ type }) }),

  // ── Report & History Retrieval ──
  getReportById: (id) => fetchApi(`/report/${id}`),
  getHistory: () => fetchApi('/history'),

  // ── Document Binary Blob Download Helpers ──
  downloadPdf: async (id) => {
    console.log(`[API Service] Triggering PDF download for Report ID: ${id}`);
    const headers = await getAuthHeaders();
    delete headers['Content-Type']; // Let fetch handle binary stream

    const res = await fetch(`${BASE_URL}/report/${id}/pdf`, { headers });
    if (!res.ok) {
      throw new Error(`Failed to generate PDF (HTTP ${res.status}).`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ProjectPilot_Report_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    console.log('[API Service] ✅ PDF downloaded successfully.');
  },

  downloadPpt: async (id) => {
    console.log(`[API Service] Triggering Pitch Deck (.pptx) download for Report ID: ${id}`);
    const headers = await getAuthHeaders();
    delete headers['Content-Type'];

    const res = await fetch(`${BASE_URL}/report/${id}/ppt`, { headers });
    if (!res.ok) {
      throw new Error(`Failed to generate Pitch Deck (HTTP ${res.status}).`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ProjectPilot_PitchDeck_${id}.pptx`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    console.log('[API Service] ✅ Pitch Deck (.pptx) downloaded successfully.');
  },

  // ── Direct URL Fallbacks ──
  getPdfDownloadUrl: (id) => `${BASE_URL}/report/${id}/pdf`,
  getPptDownloadUrl: (id) => `${BASE_URL}/report/${id}/ppt`,
};

export default apiService;
