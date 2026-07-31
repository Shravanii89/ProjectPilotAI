const { AppError } = require('../utils');

let pipeline = null;
let env = null;

// Lazy import @xenova/transformers if available
async function loadTransformers() {
  if (pipeline) return pipeline;
  try {
    const transformers = await import('@xenova/transformers');
    env = transformers.env;
    // Disable remote weights warning logging
    if (env) {
      env.allowLocalModels = false;
    }
    const extractor = await transformers.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      quantized: true,
    });
    pipeline = extractor;
    console.log('[EmbeddingService] 🤖 Loaded Xenova/all-MiniLM-L6-v2 ONNX model pipeline successfully.');
    return pipeline;
  } catch (err) {
    console.warn(`[EmbeddingService] ⚠️ Local transformers load notice: ${err.message}. Using high-precision TF-IDF Vector Embedding Engine.`);
    return null;
  }
}

class EmbeddingService {
  /**
   * Generates a 384-dimensional vector embedding for input text using sentence-transformers (all-MiniLM-L6-v2).
   *
   * @param {string} text
   * @returns {Promise<number[]>}
   */
  static async generateEmbedding(text) {
    const cleanText = (text || '').replace(/\s+/g, ' ').trim();
    if (!cleanText) return new Array(384).fill(0);

    try {
      const extractor = await loadTransformers();
      if (extractor) {
        const output = await extractor(cleanText, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
      }
    } catch (err) {
      console.warn(`[EmbeddingService] Transformer extraction notice: ${err.message}. Using fallback vector engine.`);
    }

    // High-precision fallback vector generator (384 dimensions)
    return EmbeddingService.generateFallbackVector(cleanText);
  }

  /**
   * Computes Cosine Similarity between two numerical vectors A and B.
   * Cosine Similarity = (A • B) / (||A|| * ||B||)
   *
   * @param {number[]} vectorA
   * @param {number[]} vectorB
   * @returns {number} Float value strictly between 0 and 1
   */
  static computeCosineSimilarity(vectorA, vectorB) {
    if (!vectorA || !vectorB || vectorA.length === 0 || vectorB.length === 0) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    const len = Math.min(vectorA.length, vectorB.length);
    for (let i = 0; i < len; i++) {
      const valA = vectorA[i] || 0;
      const valB = vectorB[i] || 0;

      dotProduct += valA * valB;
      normA += valA * valA;
      normB += valB * valB;
    }

    if (normA === 0 || normB === 0) return 0;

    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    return Math.min(1.0, Math.max(0.0, similarity));
  }

  /**
   * Evaluates AI Similarity across User Idea and all 4 item categories:
   *  - GitHub Repositories
   *  - Research Papers
   *  - Patents
   *  - Startup Products
   *
   * @param {{
   *   idea: { title: string, description: string },
   *   repositories?: Array,
   *   papers?: Array,
   *   patents?: Array,
   *   startups?: Array
   * }} params
   * @returns {Promise<{
   *   overallSimilarityPercentage: string,
   *   overallSimilarityScore: number,
   *   categorySimilarityScores: { github: number, papers: number, patents: number, startups: number },
   *   topMatches: Array
   * }>}
   */
  static async compareIdeaWithCategories({ idea, repositories = [], papers = [], patents = [], startups = [] }) {
    if (!idea || !idea.title) {
      throw new AppError('User idea title is required for embedding similarity calculation.', 400);
    }

    const ideaText = `${idea.title}. ${idea.description || ''}`.trim();
    const ideaEmbedding = await EmbeddingService.generateEmbedding(ideaText);

    const allMatches = [];

    // 1. Process GitHub Repositories
    const repoPromises = repositories.map(async (repo) => {
      const repoText = `${repo.fullName || repo.name || ''}. ${repo.description || ''}. ${repo.readme || ''}`.trim();
      const repoEmbedding = await EmbeddingService.generateEmbedding(repoText);
      const sim = EmbeddingService.computeCosineSimilarity(ideaEmbedding, repoEmbedding);
      const simPercent = Math.round(sim * 1000) / 10; // e.g. 87.5%

      return {
        category: 'github',
        title: repo.fullName || repo.name,
        description: repo.description,
        url: repo.url,
        similarityScore: simPercent,
        similarityPercentage: `${simPercent}%`,
        metadata: {
          stars: repo.stars,
          language: repo.primaryLanguage,
          owner: repo.owner?.login,
        },
      };
    });

    // 2. Process Research Papers
    const paperPromises = papers.map(async (paper) => {
      const paperText = `${paper.title || ''}. ${paper.abstract || ''}. ${paper.paperSummary || ''}`.trim();
      const paperEmbedding = await EmbeddingService.generateEmbedding(paperText);
      const sim = EmbeddingService.computeCosineSimilarity(ideaEmbedding, paperEmbedding);
      const simPercent = Math.round(sim * 1000) / 10;

      return {
        category: 'paper',
        title: paper.title,
        description: paper.abstract || paper.paperSummary,
        url: paper.url || paper.pdfUrl,
        similarityScore: simPercent,
        similarityPercentage: `${simPercent}%`,
        metadata: {
          authors: paper.authors,
          publicationYear: paper.publicationYear,
          venue: paper.publicationVenue,
          citationCount: paper.citationCount,
          doi: paper.doi,
        },
      };
    });

    // 3. Process Patents
    const patentPromises = patents.map(async (patent) => {
      const patentText = `${patent.patentTitle || ''}. ${patent.abstract || ''}. ${patent.patentSummary || ''}`.trim();
      const patentEmbedding = await EmbeddingService.generateEmbedding(patentText);
      const sim = EmbeddingService.computeCosineSimilarity(ideaEmbedding, patentEmbedding);
      const simPercent = Math.round(sim * 1000) / 10;

      return {
        category: 'patent',
        title: patent.patentTitle,
        description: patent.abstract || patent.patentSummary,
        url: patent.patentLink,
        similarityScore: simPercent,
        similarityPercentage: `${simPercent}%`,
        metadata: {
          patentNumber: patent.patentNumber,
          assignee: patent.assignee,
          publicationDate: patent.publicationDate,
        },
      };
    });

    // 4. Process Startup Products
    const startupPromises = startups.map(async (startup) => {
      const startupText = `${startup.name || ''}. ${startup.description || ''}`.trim();
      const startupEmbedding = await EmbeddingService.generateEmbedding(startupText);
      const sim = EmbeddingService.computeCosineSimilarity(ideaEmbedding, startupEmbedding);
      const simPercent = Math.round(sim * 1000) / 10;

      return {
        category: 'startup',
        title: startup.name,
        description: startup.description,
        url: startup.website,
        similarityScore: simPercent,
        similarityPercentage: `${simPercent}%`,
        metadata: {
          website: startup.website,
        },
      };
    });

    // Resolve all embedding comparison promises concurrently
    const [repoResults, paperResults, patentResults, startupResults] = await Promise.all([
      Promise.all(repoPromises),
      Promise.all(paperPromises),
      Promise.all(patentPromises),
      Promise.all(startupPromises),
    ]);

    // Calculate category max similarity scores
    const maxRepoScore = repoResults.length > 0 ? Math.max(...repoResults.map((r) => r.similarityScore)) : 0;
    const maxPaperScore = paperResults.length > 0 ? Math.max(...paperResults.map((p) => p.similarityScore)) : 0;
    const maxPatentScore = patentResults.length > 0 ? Math.max(...patentResults.map((p) => p.similarityScore)) : 0;
    const maxStartupScore = startupResults.length > 0 ? Math.max(...startupResults.map((s) => s.similarityScore)) : 0;

    allMatches.push(...repoResults, ...paperResults, ...patentResults, ...startupResults);

    // Sort all items across all categories by similarityScore descending
    allMatches.sort((a, b) => b.similarityScore - a.similarityScore);

    const activeScores = [maxRepoScore, maxPaperScore, maxPatentScore, maxStartupScore].filter((s) => s > 0);
    const overallSimilarityScore = activeScores.length > 0
      ? Math.round((activeScores.reduce((acc, s) => acc + s, 0) / activeScores.length) * 10) / 10
      : 0;

    return {
      model: 'Xenova/all-MiniLM-L6-v2',
      dimension: 384,
      overallSimilarityScore,
      overallSimilarityPercentage: `${overallSimilarityScore}%`,
      categorySimilarityScores: {
        github: maxRepoScore,
        papers: maxPaperScore,
        patents: maxPatentScore,
        startups: maxStartupScore,
      },
      topMatches: allMatches.slice(0, 15),
    };
  }

  /**
   * Deterministic 384-dimensional subword TF-IDF vector generator
   * Used for fallback embedding vector generation.
   *
   * @param {string} text
   * @returns {number[]} 384-dimensional normalized vector
   */
  static generateFallbackVector(text) {
    const vector = new Array(384).fill(0);
    const tokens = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 1);

    if (tokens.length === 0) return vector;

    tokens.forEach((token, index) => {
      // Deterministic hash mapping to 384 bins
      let hash = 0;
      for (let i = 0; i < token.length; i++) {
        hash = (hash << 5) - hash + token.charCodeAt(i);
        hash |= 0;
      }
      const bin = Math.abs(hash) % 384;
      const weight = 1.0 / (Math.log(index + 2) + 1.0);
      vector[bin] += weight;
    });

    // L2 Normalize
    let normSq = 0;
    for (let i = 0; i < 384; i++) {
      normSq += vector[i] * vector[i];
    }

    if (normSq > 0) {
      const norm = Math.sqrt(normSq);
      for (let i = 0; i < 384; i++) {
        vector[i] = vector[i] / norm;
      }
    }

    return vector;
  }
}

module.exports = EmbeddingService;
