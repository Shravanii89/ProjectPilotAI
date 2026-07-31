const { AppError } = require('../utils');

class InnovationDnaService {
  /**
   * Generates a comprehensive Innovation DNA Score breakdown, Radar Chart JSON,
   * improvement suggestions, weak areas, and strong areas.
   *
   * @param {{
   *   title: string,
   *   description?: string,
   *   domain?: string,
   *   similarityScore?: number,
   *   githubResults?: Array,
   *   researchPapers?: Array,
   *   patents?: Array,
   *   startups?: Array
   * }} params
   * @returns {Promise<object>} Structured Innovation DNA Engine Output
   */
  static async calculateInnovationDna({
    title,
    description = '',
    domain = 'General Software',
    similarityScore = 35,
    githubResults = [],
    researchPapers = [],
    patents = [],
    startups = [],
  }) {
    if (!title || typeof title !== 'string') {
      throw new AppError('Project title is required for Innovation DNA scoring.', 400);
    }

    const cleanTitle = title.trim();
    const cleanDesc = description.trim();

    // 1. Calculate 8 core metrics (0 - 100)
    // Novelty: Inverse of vector similarity + uniqueness bonus
    const simVal = Math.min(100, Math.max(0, similarityScore || 35));
    const novelty = Math.min(98, Math.max(25, Math.round(100 - simVal * 0.7)));

    // Technical Feasibility: Evaluates architecture and repo support
    const repoCount = githubResults.length;
    const technicalFeasibility = Math.min(95, Math.max(50, Math.round(75 + Math.min(repoCount, 5) * 3)));

    // Market Potential: Evaluates commercial readiness and startup ecosystem
    const startupCount = startups.length;
    const marketPotential = Math.min(96, Math.max(45, Math.round(70 + Math.min(startupCount, 5) * 4)));

    // Business Potential: Monetization viability rating
    const businessPotential = Math.min(94, Math.max(50, Math.round(marketPotential * 0.9 + 8)));

    // Scalability: Cloud-native capacity and modularity
    const scalability = Math.min(96, Math.max(60, Math.round(82 + (cleanDesc.length > 50 ? 6 : 0))));

    // Patentability: Intellectual property uniqueness
    const patentCount = patents.length;
    const patentability = Math.min(92, Math.max(30, Math.round(novelty * 0.85 - Math.min(patentCount, 4) * 3 + 10)));

    // Competition Readiness: Hackathon & pitch deck readiness
    const competitionReadiness = Math.min(95, Math.max(55, Math.round((novelty + technicalFeasibility + marketPotential) / 3)));

    // Social Impact: Value delivered to society & developers
    const socialImpact = Math.min(95, Math.max(50, Math.round(78 + (domain.toLowerCase().includes('health') || domain.toLowerCase().includes('eco') ? 12 : 4))));

    // 2. Calculate Weighted Composite Overall Score
    const overallScoreFloat =
      novelty * 0.20 +
      technicalFeasibility * 0.15 +
      marketPotential * 0.15 +
      businessPotential * 0.15 +
      scalability * 0.10 +
      patentability * 0.10 +
      competitionReadiness * 0.10 +
      socialImpact * 0.05;

    const overallInnovationDnaScore = Math.min(100, Math.max(0, Math.round(overallScoreFloat)));

    // 3. Generate Recharts-Compatible Radar Chart JSON
    const radarChart = [
      { subject: 'Novelty', score: novelty, fullMark: 100 },
      { subject: 'Technical Feasibility', score: technicalFeasibility, fullMark: 100 },
      { subject: 'Market Potential', score: marketPotential, fullMark: 100 },
      { subject: 'Business Potential', score: businessPotential, fullMark: 100 },
      { subject: 'Scalability', score: scalability, fullMark: 100 },
      { subject: 'Patentability', score: patentability, fullMark: 100 },
      { subject: 'Competition Readiness', score: competitionReadiness, fullMark: 100 },
      { subject: 'Social Impact', score: socialImpact, fullMark: 100 },
    ];

    // 4. Identify Strong Areas (Score >= 75) & Weak Areas (Score < 75)
    const metricsMap = {
      Novelty: { score: novelty, reason: 'High degree of algorithmic and functional uniqueness compared to prior art.' },
      'Technical Feasibility': { score: technicalFeasibility, reason: 'Strong ecosystem support and well-defined implementation path.' },
      'Market Potential': { score: marketPotential, reason: 'High total addressable market demand and commercial validation.' },
      'Business Potential': { score: businessPotential, reason: 'Clear SaaS subscription and enterprise licensing monetization model.' },
      Scalability: { score: scalability, reason: 'Cloud-native microservices architecture capable of rapid scaling.' },
      Patentability: { score: patentability, reason: 'Proprietary workflow and algorithm claims suitable for IP protection.' },
      'Competition Readiness': { score: competitionReadiness, reason: 'Well-structured pitch value proposition for competitions and investors.' },
      'Social Impact': { score: socialImpact, reason: 'Significant positive contribution to developer productivity and end-users.' },
    };

    const strongAreas = [];
    const weakAreas = [];

    Object.entries(metricsMap).forEach(([name, meta]) => {
      if (meta.score >= 75) {
        strongAreas.push({ name, score: meta.score, summary: meta.reason });
      } else {
        weakAreas.push({ name, score: meta.score, summary: meta.reason });
      }
    });

    // Ensure at least 1 entry in weakAreas and strongAreas for balanced output
    if (weakAreas.length === 0) {
      weakAreas.push({
        name: 'Patentability',
        score: patentability,
        summary: 'Requires further refinement of proprietary claims to maximize IP protection.',
      });
    }

    // 5. Generate Actionable Improvement Suggestions
    const improvementSuggestions = InnovationDnaService.generateImprovementSuggestions({
      novelty,
      patentability,
      marketPotential,
      technicalFeasibility,
      title: cleanTitle,
    });

    return {
      title: cleanTitle,
      domain,
      scores: {
        novelty,
        technicalFeasibility,
        marketPotential,
        businessPotential,
        scalability,
        patentability,
        competitionReadiness,
        socialImpact,
        overallInnovationDnaScore,
      },
      overallInnovationDnaScore,
      ratingGrade: InnovationDnaService.getRatingGrade(overallInnovationDnaScore),
      radarChart,
      strongAreas,
      weakAreas,
      improvementSuggestions,
    };
  }

  /**
   * Actionable Improvement Suggestions Generator
   */
  static generateImprovementSuggestions({ novelty, patentability, marketPotential, technicalFeasibility, title }) {
    const suggestions = [];

    if (novelty < 80) {
      suggestions.push(`Differentiate "${title}" by implementing a novel hybrid algorithm or specialized domain-specific pipeline.`);
    } else {
      suggestions.push(`Maintain high novelty by open-sourcing a modular SDK while keeping core optimization algorithms proprietary.`);
    }

    if (patentability < 75) {
      suggestions.push('Strengthen patent claims by filing a provisional patent on the unique multi-source data synthesis process.');
    } else {
      suggestions.push('Conduct a formal prior-art clearance search before public release to protect key patent claims.');
    }

    if (marketPotential < 80) {
      suggestions.push('Conduct early pilot testing with target enterprise users to validate pricing tiers and ROI value metrics.');
    } else {
      suggestions.push('Expand self-serve onboarding and developer documentation to accelerate organic market adoption.');
    }

    if (technicalFeasibility < 85) {
      suggestions.push('Containerize backend services using Docker and set up automated CI/CD unit testing for high reliability.');
    }

    suggestions.push(`Create an interactive demo video and live sandbox environment for pitch presentations and competitions.`);

    return suggestions;
  }

  /**
   * Rating Grade Helper
   */
  static getRatingGrade(score) {
    if (score >= 90) return 'A+ (Exceptional Innovation)';
    if (score >= 80) return 'A (Strong Originality & High Viability)';
    if (score >= 70) return 'B+ (Promising Project with High Potential)';
    if (score >= 60) return 'B (Moderate Feasibility - Needs Differentiation)';
    return 'C (Requires Major Concept Refinement)';
  }
}

module.exports = InnovationDnaService;
