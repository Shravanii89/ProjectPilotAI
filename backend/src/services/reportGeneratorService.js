const { v4: uuidv4 } = require('uuid');
const GitHubService = require('./githubService');
const PaperService = require('./paperService');
const PatentService = require('./patentService');
const StartupSearchService = require('./startupSearchService');
const EmbeddingService = require('./embeddingService');
const InnovationDnaService = require('./innovationDnaService');
const GeminiService = require('./geminiService');
const DbService = require('./dbService');

class ReportGeneratorService {
  /**
   * Generates a complete, unified Innovation Validation Report combining all 6 intelligence modules.
   * Produces structured JSON and publication-ready Markdown text.
   *
   * @param {{
   *   title: string,
   *   description: string,
   *   domain?: string,
   *   competition?: string,
   *   userId?: string,
   *   email?: string
   * }} params
   * @returns {Promise<object>} Unified JSON & Markdown Report
   */
  static async generateFullReport({ title, description, domain = 'General Software', competition = 'medium', userId, email }) {
    const reportId = uuidv4();
    console.log(`[ReportGenerator] 🚀 Generating full unified report [${reportId}] for: "${title}"`);

    // 1. Concurrently fetch multi-source intelligence modules
    const [githubData, paperData, patentData, startupData] = await Promise.all([
      GitHubService.searchRepositories({ title, description, limit: 6 }).catch(() => ({ repositories: [], totalCount: 0 })),
      PaperService.searchPapers({ title, description, limit: 6 }).catch(() => ({ papers: [], totalCount: 0 })),
      PatentService.searchPatents({ title, description, limit: 6 }).catch(() => ({ patents: [], totalCount: 0 })),
      StartupSearchService.searchStartupsAndHackathons({ title, description, limit: 6 }).catch(() => ({ startups: [], hackathonProjects: [] })),
    ]);

    // 2. Run AI Similarity Engine (sentence-transformers cosine similarity)
    const similarityData = await EmbeddingService.compareIdeaWithCategories({
      idea: { title, description },
      repositories: githubData.repositories || [],
      papers: paperData.papers || [],
      patents: patentData.patents || [],
      startups: startupData.startups || [],
    }).catch(() => ({ overallSimilarityScore: 35, overallSimilarityPercentage: '35%' }));

    // 3. Calculate Innovation DNA Scores & Radar Chart
    const dnaData = await InnovationDnaService.calculateInnovationDna({
      title,
      description,
      domain,
      similarityScore: similarityData.overallSimilarityScore || 35,
      githubResults: githubData.repositories || [],
      researchPapers: paperData.papers || [],
      patents: patentData.patents || [],
      startups: startupData.startups || [],
    });

    // 4. Run Google Gemini 2.5 Flash Synthesis
    const geminiData = await GeminiService.analyzeProjectIntelligence({
      title,
      description,
      githubResults: githubData.repositories || [],
      researchPapers: paperData.papers || [],
      patents: patentData.patents || [],
      startupSearch: startupData,
      similarityAnalysis: similarityData,
    });

    // 5. Build 14 Structured Report Sections
    const sections = {
      executiveSummary: geminiData.executiveSummary || `Executive Analysis for "${title}": Innovative platform addressing key challenges in ${domain}.`,
      innovationDna: {
        overallScore: dnaData.overallInnovationDnaScore,
        ratingGrade: dnaData.ratingGrade,
        scores: dnaData.scores,
        radarChart: dnaData.radarChart,
        strongAreas: dnaData.strongAreas,
        weakAreas: dnaData.weakAreas,
      },
      noveltyReport: {
        summary: geminiData.noveltyAnalysis,
        vectorSimilarity: similarityData.overallSimilarityPercentage,
        similarMatchesCount: similarityData.topMatches?.length || 0,
      },
      competitionAnalysis: {
        marketCompetitors: startupData.startups || [],
        hackathonProjects: startupData.hackathonProjects || [],
        openSourceRepos: (githubData.repositories || []).slice(0, 3),
      },
      technologyStack: geminiData.technologyStack || {
        frontend: 'React.js, Vite, Vanilla CSS',
        backend: 'Node.js, Express.js (MVC)',
        database: 'PostgreSQL, Prisma ORM',
        ai_ml: 'Google Gemini 2.5 Flash, Xenova/all-MiniLM-L6-v2',
      },
      architectureRecommendation: `Microservices-based cloud architecture utilizing Node.js Express REST APIs, PostgreSQL for relational storage & cache, and containerized AI worker pools for vector similarity calculation.`,
      implementationRoadmap: geminiData.developmentRoadmap || [
        { phase: 'Phase 1: MVP', duration: 'Weeks 1-4', details: 'Core backend, DB schema & search integration' },
        { phase: 'Phase 2: AI & UI Integration', duration: 'Weeks 5-8', details: 'Vector similarity, Gemini synthesis & React dashboard' },
        { phase: 'Phase 3: Beta & Scaling', duration: 'Weeks 9-12', details: 'Public deployment, security auditing & export tools' },
      ],
      timeline: geminiData.timeline || '10 - 12 Weeks to MVP Release',
      estimatedBudget: geminiData.costEstimation || {
        cloudInfrastructure: '$50 - $150 / month',
        apiCosts: '$0 - $100 / month',
        development: 'Internal core engineering',
        totalEstimatedBudget: '$200 / month operational seed budget',
      },
      recommendedFeatures: geminiData.suggestedFeatures || [
        'Multi-source intelligence dashboard',
        'Innovation DNA score calculation',
        'Interactive 3D vector space visualization',
        'Export Pitch Deck & Patent Claims in PDF',
      ],
      patentOpportunities: geminiData.patentability || 'Proprietary claims around multi-source similarity aggregation and automated synthesis.',
      researchGaps: (paperData.papers || []).map((p) => p.researchGap).filter(Boolean).slice(0, 3),
      businessOpportunities: geminiData.marketPotential || 'High TAM demand with B2B SaaS subscription and developer API licensing.',
      futureScope: geminiData.futureScope || 'Enterprise IP defense, automated patent filing, and VC pitch evaluation.',
    };

    // 6. Generate GitHub-Flavored Markdown Report
    const markdownReport = ReportGeneratorService.generateMarkdownDocument({
      title,
      description,
      domain,
      reportId,
      sections,
      githubResults: githubData.repositories || [],
      papers: paperData.papers || [],
      patents: patentData.patents || [],
      startups: startupData.startups || [],
    });

    const fullResult = {
      reportId,
      title,
      description,
      domain,
      competition,
      generatedAt: new Date().toISOString(),
      sections,
      rawIntelligence: {
        githubCount: githubData.repositories?.length || 0,
        papersCount: paperData.papers?.length || 0,
        patentsCount: patentData.patents?.length || 0,
        startupsCount: startupData.startups?.length || 0,
        similarityScore: similarityData.overallSimilarityPercentage,
      },
      markdownReport,
    };

    // 7. Save to PostgreSQL DB if userId provided
    if (userId) {
      try {
        let dbUser = await DbService.getUserByFirebaseUid(userId);
        if (!dbUser) {
          dbUser = await DbService.createUser({
            firebaseUid: userId,
            email: email || `${userId.toLowerCase()}@projectpilot.ai`,
            name: 'ProjectPilot User',
          });
        }

        const project = await DbService.createProject({
          userId: dbUser.id,
          title,
          description: description || title,
          domain,
          competition,
        });

        const dbReport = await DbService.createReport({
          projectId: project.id,
          innovationScore: dnaData.scores.novelty,
          feasibilityScore: dnaData.scores.technicalFeasibility,
          marketScore: dnaData.scores.marketPotential,
          overallScore: dnaData.overallInnovationDnaScore,
          summary: sections.executiveSummary,
          patentSummary: { patentability: sections.patentOpportunities, count: patentData.patents?.length },
          paperSummary: { researchGaps: sections.researchGaps, count: paperData.papers?.length },
          recommendations: dnaData.improvementSuggestions,
        });

        await DbService.createHistoryRecord({
          userId: dbUser.id,
          projectId: project.id,
          action: 'full_report_generated',
        });

        fullResult.projectId = project.id;
        fullResult.savedToDatabase = true;
      } catch (dbErr) {
        console.warn('[ReportGenerator] Database save notice:', dbErr.message);
      }
    }

    return fullResult;
  }

  /**
   * Generates publication-ready Markdown text for the full report
   */
  static generateMarkdownDocument({ title, description, domain, reportId, sections, githubResults, papers, patents, startups }) {
    const dna = sections.innovationDna;
    const scores = dna.scores || {};

    return `# 🚀 ProjectPilot AI – Innovation Validation Report
**Project Title**: ${title}  
**Domain**: ${domain} | **Report ID**: \`${reportId}\`  
**Generated At**: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

---

## 📌 Executive Summary
${sections.executiveSummary}

---

## 🧬 Innovation DNA Score (${dna.overallScore}/100 - ${dna.ratingGrade})

| Metric | Score | Rating |
| :--- | :---: | :--- |
| **Novelty** | ${scores.novelty}/100 | ${scores.novelty >= 75 ? 'High' : 'Moderate'} |
| **Technical Feasibility** | ${scores.technicalFeasibility}/100 | ${scores.technicalFeasibility >= 75 ? 'High' : 'Moderate'} |
| **Market Potential** | ${scores.marketPotential}/100 | ${scores.marketPotential >= 75 ? 'High' : 'Moderate'} |
| **Business Potential** | ${scores.businessPotential}/100 | ${scores.businessPotential >= 75 ? 'High' : 'Moderate'} |
| **Scalability** | ${scores.scalability}/100 | ${scores.scalability >= 75 ? 'High' : 'Moderate'} |
| **Patentability** | ${scores.patentability}/100 | ${scores.patentability >= 75 ? 'High' : 'Moderate'} |
| **Competition Readiness** | ${scores.competitionReadiness}/100 | ${scores.competitionReadiness >= 75 ? 'High' : 'Moderate'} |
| **Social Impact** | ${scores.socialImpact}/100 | ${scores.socialImpact >= 75 ? 'High' : 'Moderate'} |

---

## 💡 Novelty Report
- **Vector Similarity Index**: \`${sections.noveltyReport.vectorSimilarity}\`
- **Novelty Assessment**: ${sections.noveltyReport.summary}

---

## 📊 Competition Analysis

### Top Market Competitors
${(startups || []).slice(0, 3).map((s, i) => `${i + 1}. **${s.name}**: ${s.description} ([Website](${s.website}))`).join('\n') || 'No direct commercial competitors found.'}

### Open-Source Repositories (GitHub)
${(githubResults || []).slice(0, 3).map((g, i) => `${i + 1}. [${g.fullName || g.name}](${g.url}) (⭐ ${g.stars} | ${g.primaryLanguage}): ${g.description}`).join('\n') || 'No similar open-source repos found.'}

---

## 💻 Technology Stack & Architecture Recommendation

### Technology Stack
- **Frontend**: ${sections.technologyStack.frontend}
- **Backend**: ${sections.technologyStack.backend}
- **Database**: ${sections.technologyStack.database}
- **AI/ML Engine**: ${sections.technologyStack.ai_ml}
- **DevOps**: ${sections.technologyStack.devops || 'Docker, GitHub Actions, Vercel'}

### Recommended Architecture
${sections.architectureRecommendation}

---

## 🗺️ Implementation Roadmap & Timeline

**Total Estimated Timeline**: ${sections.timeline}

${(sections.implementationRoadmap || []).map((r) => `### ${r.phase} (${r.duration})\n- ${r.details}`).join('\n\n')}

---

## 💰 Estimated Budget & Costs
- **Cloud Infrastructure**: ${sections.estimatedBudget.cloudInfrastructure || '$50-$150/mo'}
- **API Services**: ${sections.estimatedBudget.apiCosts || '$0-$100/mo'}
- **Total Operational Budget**: **${sections.estimatedBudget.totalEstimatedBudget || '$200/month'}**

---

## 🚀 Recommended Features
${(sections.recommendedFeatures || []).map((f) => `- ${f}`).join('\n')}

---

## 📜 Patent Opportunities & IP Protection
${sections.patentOpportunities}

---

## 🔬 Research Gaps Identified
${(sections.researchGaps || []).map((g) => `- ${g}`).join('\n') || '- Opportunity to publish empirical benchmark paper on automated multi-source AI synthesis.'}

---

## 📈 Business Opportunities & Future Scope
- **Business Opportunities**: ${sections.businessOpportunities}
- **Future Scope**: ${sections.futureScope}

---
*Report generated automatically by ProjectPilot AI Engine.*
`;
  }
}

module.exports = ReportGeneratorService;
