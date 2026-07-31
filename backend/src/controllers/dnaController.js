const { InnovationDnaService, GitHubService, PaperService, PatentService, StartupSearchService, EmbeddingService } = require('../services');
const { catchAsync, sendResponse } = require('../utils');

/**
 * POST /api/analyze/dna
 * Innovation DNA Engine endpoint.
 * Calculates 0-100 scores across 8 dimensions (Novelty, Feasibility, Market, Business, Scalability, Patentability, Competition Readiness, Social Impact)
 * and generates overall Innovation DNA score, Recharts-compatible Radar Chart JSON, strong/weak areas, and actionable improvement suggestions.
 */
exports.calculateDna = catchAsync(async (req, res) => {
  const { title, description, domain, similarityScore, repositories, papers, patents, startups, autoFetch = true } = req.body;

  let repoList = repositories || [];
  let paperList = papers || [];
  let patentList = patents || [];
  let startupList = startups || [];
  let calcSimScore = similarityScore;

  // Auto-fetch if intelligence items are not supplied
  if (autoFetch && title) {
    const fetchPromises = [];

    if (repoList.length === 0) {
      fetchPromises.push(
        GitHubService.searchRepositories({ title, description, limit: 5 })
          .then((r) => (repoList = r.repositories || []))
          .catch(() => {})
      );
    }

    if (paperList.length === 0) {
      fetchPromises.push(
        PaperService.searchPapers({ title, description, limit: 5 })
          .then((r) => (paperList = r.papers || []))
          .catch(() => {})
      );
    }

    if (patentList.length === 0) {
      fetchPromises.push(
        PatentService.searchPatents({ title, description, limit: 5 })
          .then((r) => (patentList = r.patents || []))
          .catch(() => {})
      );
    }

    if (startupList.length === 0) {
      fetchPromises.push(
        StartupSearchService.searchStartupsAndHackathons({ title, description, limit: 5 })
          .then((r) => (startupList = r.startups || []))
          .catch(() => {})
      );
    }

    await Promise.all(fetchPromises);

    if (calcSimScore === undefined || calcSimScore === null) {
      try {
        const simResult = await EmbeddingService.compareIdeaWithCategories({
          idea: { title, description },
          repositories: repoList,
          papers: paperList,
          patents: patentList,
          startups: startupList,
        });
        calcSimScore = simResult.overallSimilarityScore;
      } catch (_e) {
        calcSimScore = 35;
      }
    }
  }

  const dnaResult = await InnovationDnaService.calculateInnovationDna({
    title,
    description: description || '',
    domain: domain || 'General Software',
    similarityScore: calcSimScore || 35,
    githubResults: repoList,
    researchPapers: paperList,
    patents: patentList,
    startups: startupList,
  });

  sendResponse(res, 200, 'Innovation DNA Engine analysis completed successfully.', dnaResult);
});
