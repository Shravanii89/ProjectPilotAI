const { EmbeddingService, GitHubService, PaperService, PatentService, StartupSearchService } = require('../services');
const { catchAsync, sendResponse } = require('../utils');

/**
 * POST /api/search/similarity
 * AI Similarity Engine endpoint.
 * Computes 384-dimensional sentence-transformer (all-MiniLM-L6-v2) embeddings and cosine similarity
 * across User Idea, GitHub repos, Research papers, Patents, and Startup products.
 */
exports.computeSimilarity = catchAsync(async (req, res) => {
  const { title, description, repositories, papers, patents, startups, autoFetch = true } = req.body;

  let repoList = repositories || [];
  let paperList = papers || [];
  let patentList = patents || [];
  let startupList = startups || [];

  // Auto-fetch if category items are not provided in payload
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
  }

  const result = await EmbeddingService.compareIdeaWithCategories({
    idea: { title, description },
    repositories: repoList,
    papers: paperList,
    patents: patentList,
    startups: startupList,
  });

  sendResponse(res, 200, 'AI Similarity Engine computation completed successfully.', result);
});
