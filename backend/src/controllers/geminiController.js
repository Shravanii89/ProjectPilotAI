const { GeminiService, GitHubService, PaperService, PatentService, StartupSearchService, EmbeddingService } = require('../services');
const { catchAsync, sendResponse } = require('../utils');

/**
 * POST /api/analyze/gemini
 * Google Gemini 2.5 Flash intelligence endpoint.
 * Synthesizes inputs across GitHub, Papers, Patents, Startups, and Similarity scores,
 * returning valid JSON containing all 13 analytical sections.
 */
exports.analyzeWithGemini = catchAsync(async (req, res) => {
  const { title, description, repositories, papers, patents, startupSearch, similarityAnalysis, autoFetch = true } = req.body;

  let repoList = repositories || [];
  let paperList = papers || [];
  let patentList = patents || [];
  let startupData = startupSearch || {};
  let similarityData = similarityAnalysis || {};

  // Auto-fetch missing intelligence modules if autoFetch is enabled
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

    if (!startupData.startups) {
      fetchPromises.push(
        StartupSearchService.searchStartupsAndHackathons({ title, description, limit: 5 })
          .then((r) => (startupData = r))
          .catch(() => {})
      );
    }

    await Promise.all(fetchPromises);

    if (!similarityData.overallSimilarityPercentage) {
      similarityData = await EmbeddingService.compareIdeaWithCategories({
        idea: { title, description },
        repositories: repoList,
        papers: paperList,
        patents: patentList,
        startups: startupData.startups || [],
      }).catch(() => ({}));
    }
  }

  const analysisResult = await GeminiService.analyzeProjectIntelligence({
    title,
    description: description || '',
    githubResults: repoList,
    researchPapers: paperList,
    patents: patentList,
    startupSearch: startupData,
    similarityAnalysis: similarityData,
  });

  sendResponse(res, 200, 'Google Gemini 2.5 Flash analysis completed successfully.', analysisResult);
});
