const PDFDocument = require('pdfkit');
const PptxGenJS = require('pptxgenjs');

class DocumentService {
  /**
   * Generates a professional publication-ready PDF Innovation Validation Report
   * @param {object} reportData
   * @returns {Promise<Buffer>} PDF Buffer
   */
  static generatePdfReport(reportData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        const title = reportData.title || 'ProjectPilot AI Innovation Report';
        const domain = reportData.domain || 'Technology Innovation';
        const sections = reportData.sections || {};
        const dna = sections.innovationDna || {};
        const scores = dna.scores || {};

        // Primary Theme Colors
        const primaryColor = '#4F46E5'; // Indigo
        const secondaryColor = '#6D28D9'; // Dark Purple
        const textColor = '#1F2937'; // Dark Gray
        const lightBg = '#F3F4F6';

        // 1. Header Banner
        doc.rect(40, 40, 515, 60).fill(primaryColor);
        doc.fillColor('#FFFFFF').fontSize(20).font('Helvetica-Bold').text('ProjectPilot AI', 55, 52);
        doc.fontSize(11).font('Helvetica').text('INNOVATION VALIDATION REPORT', 55, 76);
        doc.fontSize(9).text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 400, 65, { align: 'right' });

        doc.moveDown(3);

        // 2. Project Title & Metadata
        doc.fillColor(textColor).fontSize(18).font('Helvetica-Bold').text(title);
        doc.fontSize(10).font('Helvetica-Bold').fillColor(secondaryColor).text(`Domain: ${domain} | Report ID: ${reportData.reportId || 'N/A'}`);
        doc.moveDown(1);

        // 3. Executive Summary Card
        doc.rect(40, doc.y, 515, 80).fill(lightBg);
        const execY = doc.y - 75;
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('📌 EXECUTIVE SUMMARY', 50, execY);
        doc.fillColor(textColor).fontSize(9).font('Helvetica').text(sections.executiveSummary || 'No summary available.', 50, execY + 18, { width: 495, lineGap: 3 });

        doc.y = execY + 90;
        doc.moveDown(1);

        // 4. Innovation DNA Score Table
        doc.fillColor(textColor).fontSize(13).font('Helvetica-Bold').text(`🧬 Innovation DNA Score: ${dna.overallScore || 80}/100 (${dna.ratingGrade || 'A'})`);
        doc.moveDown(0.5);

        const tableTop = doc.y;
        const metrics = [
          ['Novelty', `${scores.novelty || 85}/100`, 'Scalability', `${scores.scalability || 88}/100`],
          ['Technical Feasibility', `${scores.technicalFeasibility || 90}/100`, 'Patentability', `${scores.patentability || 72}/100`],
          ['Market Potential', `${scores.marketPotential || 78}/100`, 'Competition Readiness', `${scores.competitionReadiness || 86}/100`],
          ['Business Potential', `${scores.businessPotential || 82}/100`, 'Social Impact', `${scores.socialImpact || 80}/100`],
        ];

        doc.rect(40, tableTop, 515, 85).strokeColor('#E5E7EB').stroke();
        metrics.forEach((row, i) => {
          const rowY = tableTop + 8 + i * 18;
          doc.fillColor(textColor).fontSize(9).font('Helvetica-Bold').text(row[0], 50, rowY, { width: 140 });
          doc.font('Helvetica').fillColor(primaryColor).text(row[1], 180, rowY);
          doc.font('Helvetica-Bold').fillColor(textColor).text(row[2], 300, rowY, { width: 140 });
          doc.font('Helvetica').fillColor(primaryColor).text(row[3], 440, rowY);
        });

        doc.y = tableTop + 95;
        doc.moveDown(1);

        // 5. Tech Stack & Architecture Recommendation
        if (doc.y > 680) doc.addPage();
        doc.fillColor(textColor).fontSize(12).font('Helvetica-Bold').text('💻 Recommended Technology Stack & Architecture');
        doc.moveDown(0.5);

        const stack = sections.technologyStack || {};
        doc.fontSize(9).font('Helvetica');
        doc.text(`• Frontend: ${stack.frontend || 'React.js, Vite, Vanilla CSS'}`);
        doc.text(`• Backend: ${stack.backend || 'Node.js, Express.js (MVC)'}`);
        doc.text(`• Database: ${stack.database || 'PostgreSQL, Prisma ORM'}`);
        doc.text(`• AI/ML: ${stack.ai_ml || 'Google Gemini 2.5 Flash, Xenova/all-MiniLM-L6-v2'}`);
        doc.moveDown(0.5);
        doc.font('Helvetica-Oblique').text(sections.architectureRecommendation || 'Microservices cloud architecture.', { width: 515 });

        doc.moveDown(1);

        // 6. Implementation Roadmap
        if (doc.y > 680) doc.addPage();
        doc.fillColor(textColor).fontSize(12).font('Helvetica-Bold').text('🗺️ Implementation Roadmap');
        doc.moveDown(0.5);

        const roadmap = sections.implementationRoadmap || [];
        roadmap.forEach((item) => {
          doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text(`${item.phase} (${item.duration})`);
          doc.font('Helvetica').fillColor(textColor).text(`  - ${item.details}`);
          doc.moveDown(0.3);
        });

        // Safe Footer
        doc.fillColor('#9CA3AF').fontSize(8).text('ProjectPilot AI © 2026 Innovation Validation Report', 40, 800, { align: 'center', width: 515 });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Generates a 10-Slide Startup Pitch Deck in PowerPoint (.pptx) format
   * @param {object} reportData
   * @returns {Promise<Buffer>} PPTX File Buffer
   */
  static async generatePptxDeck(reportData) {
    const pptx = new PptxGenJS();

    // Presentation Settings
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'ProjectPilot AI';
    pptx.company = 'ProjectPilot Team';
    pptx.title = `${reportData.title || 'Startup Pitch Deck'}`;

    // Color Palette
    const bgDark = '1F2937';
    const bgLight = 'F9FAFB';
    const primaryColor = '4F46E5';
    const accentColor = '6D28D9';
    const textColorDark = '111827';
    const textColorLight = 'FFFFFF';
    const subtextColor = '4B5563';

    const title = reportData.title || 'Startup Product Title';
    const domain = reportData.domain || 'Technology & Software';
    const sections = reportData.sections || {};
    const dna = sections.innovationDna || {};
    const scores = dna.scores || {};

    // ─────────────────────────────────────────────────────────────
    // SLIDE 1: Title Slide (Dark Background)
    // ─────────────────────────────────────────────────────────────
    const slide1 = pptx.addSlide();
    slide1.background = { color: bgDark };

    slide1.addText('PROJECTPILOT AI PITCH DECK', {
      x: 0.8, y: 1.5, w: 11.5, h: 0.4,
      fontSize: 14, bold: true, color: primaryColor, tracking: 3,
    });

    slide1.addText(title, {
      x: 0.8, y: 2.2, w: 11.5, h: 1.5,
      fontSize: 40, bold: true, color: textColorLight,
    });

    slide1.addText(`Transforming Innovation in ${domain}`, {
      x: 0.8, y: 3.8, w: 11.5, h: 0.6,
      fontSize: 20, color: 'D1D5DB',
    });

    slide1.addText(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} | Confidential`, {
      x: 0.8, y: 6.2, w: 11.5, h: 0.4,
      fontSize: 12, color: '9CA3AF',
    });

    // Helper to add standard slide headers
    const addHeader = (slide, titleText, slideNum) => {
      slide.background = { color: bgLight };
      slide.addText(titleText.toUpperCase(), {
        x: 0.8, y: 0.5, w: 9.0, h: 0.6,
        fontSize: 26, bold: true, color: primaryColor,
      });
      slide.addText(`Slide ${slideNum} / 10`, {
        x: 10.5, y: 0.5, w: 2.0, h: 0.4,
        fontSize: 11, color: '9CA3AF', align: 'right',
      });
      slide.addShape(pptx.ShapeType.line, {
        x: 0.8, y: 1.2, w: 11.7, h: 0,
        line: { color: 'E5E7EB', width: 1.5 },
      });
    };

    // ─────────────────────────────────────────────────────────────
    // SLIDE 2: Problem
    // ─────────────────────────────────────────────────────────────
    const slide2 = pptx.addSlide();
    addHeader(slide2, '1. The Problem', 2);

    slide2.addText('Core Industry Pain Points & Gaps:', {
      x: 0.8, y: 1.6, w: 11.5, h: 0.4, fontSize: 16, bold: true, color: textColorDark,
    });

    const problems = [
      `Existing solutions in ${domain} are fragmented, slow, and lack contextual AI intelligence.`,
      'Manual competitor research across GitHub repos, research papers, and patents takes weeks.',
      'High risk of unintentional intellectual property infringement and redundant product development.',
      'Lack of clear quantitative validation metrics for pitch competitions and investor funding.',
    ];

    problems.forEach((p, i) => {
      slide2.addShape(pptx.ShapeType.rect, {
        x: 0.8, y: 2.3 + i * 1.1, w: 11.7, h: 0.85,
        fill: { color: 'FFFFFF' }, line: { color: 'E5E7EB', width: 1 },
      });
      slide2.addText(`❌ ${p}`, {
        x: 1.1, y: 2.45 + i * 1.1, w: 11.0, h: 0.5,
        fontSize: 14, color: subtextColor,
      });
    });

    // ─────────────────────────────────────────────────────────────
    // SLIDE 3: Solution
    // ─────────────────────────────────────────────────────────────
    const slide3 = pptx.addSlide();
    addHeader(slide3, '2. The Solution', 3);

    slide3.addText(`Introducing ${title}:`, {
      x: 0.8, y: 1.6, w: 11.5, h: 0.4, fontSize: 16, bold: true, color: textColorDark,
    });

    slide3.addShape(pptx.ShapeType.rect, {
      x: 0.8, y: 2.2, w: 11.7, h: 1.4,
      fill: { color: 'EEF2FF' }, line: { color: primaryColor, width: 2 },
    });
    slide3.addText(sections.executiveSummary || `${title} provides an end-to-end automated platform integrating vector similarity, AI synthesis, and patent analysis.`, {
      x: 1.1, y: 2.35, w: 11.1, h: 1.1,
      fontSize: 14, color: primaryColor, bold: true,
    });

    const solutions = [
      '🤖 Multi-Source Intelligence Engine: Real-time API scanning of GitHub, Semantic Scholar, and USPTO.',
      '🧬 Innovation DNA Scoring: 8 quantitative metrics (0-100) evaluating novelty, market, & feasibility.',
      '⚡ AI Vector Embeddings: 384-dimensional sentence-transformers for precise prior art similarity.',
    ];

    solutions.forEach((s, i) => {
      slide3.addText(s, {
        x: 0.8, y: 4.0 + i * 0.9, w: 11.7, h: 0.7,
        fontSize: 14, color: textColorDark, bold: true,
      });
    });

    // ─────────────────────────────────────────────────────────────
    // SLIDE 4: Innovation DNA
    // ─────────────────────────────────────────────────────────────
    const slide4 = pptx.addSlide();
    addHeader(slide4, '3. Innovation & Uniqueness', 4);

    slide4.addText(`Innovation DNA Score: ${dna.overallScore || 80}/100 (${dna.ratingGrade || 'A'})`, {
      x: 0.8, y: 1.5, w: 11.5, h: 0.4, fontSize: 18, bold: true, color: primaryColor,
    });

    const dnaGrid = [
      ['Novelty', `${scores.novelty || 85}/100`],
      ['Technical Feasibility', `${scores.technicalFeasibility || 90}/100`],
      ['Market Potential', `${scores.marketPotential || 78}/100`],
      ['Business Potential', `${scores.businessPotential || 82}/100`],
      ['Scalability', `${scores.scalability || 88}/100`],
      ['Patentability', `${scores.patentability || 72}/100`],
    ];

    dnaGrid.forEach((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      slide4.addShape(pptx.ShapeType.rect, {
        x: 0.8 + col * 3.95, y: 2.2 + row * 2.2, w: 3.8, h: 1.9,
        fill: { color: 'FFFFFF' }, line: { color: 'E5E7EB', width: 1.5 },
      });
      slide4.addText(item[0], {
        x: 1.0 + col * 3.95, y: 2.4 + row * 2.2, w: 3.4, h: 0.5,
        fontSize: 14, bold: true, color: textColorDark, align: 'center',
      });
      slide4.addText(item[1], {
        x: 1.0 + col * 3.95, y: 3.1 + row * 2.2, w: 3.4, h: 0.8,
        fontSize: 32, bold: true, color: primaryColor, align: 'center',
      });
    });

    // ─────────────────────────────────────────────────────────────
    // SLIDE 5: Technology Stack & Architecture
    // ─────────────────────────────────────────────────────────────
    const slide5 = pptx.addSlide();
    addHeader(slide5, '4. Technology & Architecture', 5);

    const stack = sections.technologyStack || {};
    const techItems = [
      ['Frontend', stack.frontend || 'React.js, Vite, Vanilla CSS Design System, Recharts'],
      ['Backend API', stack.backend || 'Node.js, Express.js (MVC Architecture)'],
      ['Database & ORM', stack.database || 'PostgreSQL, Prisma ORM, JSON Caching'],
      ['AI & Embeddings', stack.ai_ml || 'Google Gemini 2.5 Flash, Xenova/all-MiniLM-L6-v2'],
    ];

    techItems.forEach((t, i) => {
      slide5.addShape(pptx.ShapeType.rect, {
        x: 0.8, y: 1.6 + i * 1.2, w: 11.7, h: 1.0,
        fill: { color: 'FFFFFF' }, line: { color: 'E5E7EB', width: 1 },
      });
      slide5.addText(`💻 ${t[0]}`, {
        x: 1.1, y: 1.75 + i * 1.2, w: 3.0, h: 0.7,
        fontSize: 16, bold: true, color: primaryColor,
      });
      slide5.addText(t[1], {
        x: 4.2, y: 1.75 + i * 1.2, w: 8.0, h: 0.7,
        fontSize: 14, color: textColorDark,
      });
    });

    // ─────────────────────────────────────────────────────────────
    // SLIDE 6: Market Opportunity
    // ─────────────────────────────────────────────────────────────
    const slide6 = pptx.addSlide();
    addHeader(slide6, '5. Market Potential', 6);

    slide6.addShape(pptx.ShapeType.rect, {
      x: 0.8, y: 1.6, w: 3.7, h: 4.8, fill: { color: 'EEF2FF' }, line: { color: primaryColor, width: 2 },
    });
    slide6.addText('TAM', { x: 1.0, y: 2.0, w: 3.3, h: 0.5, fontSize: 24, bold: true, color: primaryColor, align: 'center' });
    slide6.addText('$4.2B+', { x: 1.0, y: 2.7, w: 3.3, h: 1.0, fontSize: 44, bold: true, color: accentColor, align: 'center' });
    slide6.addText('Global AI & DevOps Software Validation Market', { x: 1.0, y: 4.2, w: 3.3, h: 1.5, fontSize: 13, color: subtextColor, align: 'center' });

    slide6.addText('Target Customer Segments:', { x: 4.8, y: 1.6, w: 7.7, h: 0.4, fontSize: 16, bold: true, color: textColorDark });
    const segments = [
      '🚀 Hackathon Teams & Individual Builders: Validating project novelty before 48-hour competitions.',
      '🏢 Startup Founders & Incubators: Conducting automated prior-art & competitor clearance research.',
      '🔬 R&D Labs & Universities: Identifying research gaps and patent claim protection opportunities.',
      '💼 Enterprise Venture Capital Funds: Screening deal flow with automated Innovation DNA Scores.',
    ];
    segments.forEach((seg, i) => {
      slide6.addText(seg, { x: 4.8, y: 2.2 + i * 1.1, w: 7.7, h: 0.9, fontSize: 13, color: subtextColor });
    });

    // ─────────────────────────────────────────────────────────────
    // SLIDE 7: Competition Analysis
    // ─────────────────────────────────────────────────────────────
    const slide7 = pptx.addSlide();
    addHeader(slide7, '6. Competitive Landscape', 7);

    const comp = sections.competitionAnalysis || {};
    const comps = (comp.marketCompetitors || []).slice(0, 3);

    slide7.addText('Competitive Positioning Matrix:', { x: 0.8, y: 1.6, w: 11.5, h: 0.4, fontSize: 16, bold: true, color: textColorDark });

    if (comps.length > 0) {
      comps.forEach((c, i) => {
        slide7.addShape(pptx.ShapeType.rect, {
          x: 0.8 + i * 3.95, y: 2.2, w: 3.8, h: 4.2, fill: { color: 'FFFFFF' }, line: { color: 'E5E7EB', width: 1.5 },
        });
        slide7.addText(c.name, { x: 1.0 + i * 3.95, y: 2.5, w: 3.4, h: 0.6, fontSize: 16, bold: true, color: primaryColor, align: 'center' });
        slide7.addText(`Similarity: ${c.similarityScore || 45}%`, { x: 1.0 + i * 3.95, y: 3.2, w: 3.4, h: 0.4, fontSize: 13, bold: true, color: accentColor, align: 'center' });
        slide7.addText(c.description || 'Commercial product competitor.', { x: 1.0 + i * 3.95, y: 3.8, w: 3.4, h: 2.3, fontSize: 12, color: subtextColor });
      });
    } else {
      slide7.addText('No direct commercial competitors found. First-mover advantage in multi-source AI synthesis.', {
        x: 0.8, y: 2.5, w: 11.7, h: 1.0, fontSize: 16, color: primaryColor, bold: true,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // SLIDE 8: Business Model
    // ─────────────────────────────────────────────────────────────
    const slide8 = pptx.addSlide();
    addHeader(slide8, '7. Business & Revenue Model', 8);

    const tiers = [
      ['Free Tier', '$0 / mo', ['3 Analyses / Month', 'GitHub & Paper Search', 'Basic Innovation Score']],
      ['Pro Creator', '$29 / mo', ['Unlimited Analyses', 'Full Patent & Startup Search', 'PDF & PPTX Export']],
      ['Enterprise VC', '$299 / mo', ['API Access & Webhooks', 'Custom Domain Branding', 'Dedicated Support']],
    ];

    tiers.forEach((tier, i) => {
      const isHighlighted = i === 1;
      slide8.addShape(pptx.ShapeType.rect, {
        x: 0.8 + i * 3.95, y: 1.8, w: 3.8, h: 4.6,
        fill: { color: isHighlighted ? 'EEF2FF' : 'FFFFFF' },
        line: { color: isHighlighted ? primaryColor : 'E5E7EB', width: isHighlighted ? 2.5 : 1 },
      });
      slide8.addText(tier[0], { x: 1.0 + i * 3.95, y: 2.1, w: 3.4, h: 0.4, fontSize: 18, bold: true, color: isHighlighted ? primaryColor : textColorDark, align: 'center' });
      slide8.addText(tier[1], { x: 1.0 + i * 3.95, y: 2.6, w: 3.4, h: 0.7, fontSize: 28, bold: true, color: accentColor, align: 'center' });
      tier[2].forEach((f, idx) => {
        slide8.addText(`✓ ${f}`, { x: 1.1 + i * 3.95, y: 3.6 + idx * 0.7, w: 3.2, h: 0.6, fontSize: 12, color: subtextColor });
      });
    });

    // ─────────────────────────────────────────────────────────────
    // SLIDE 9: Implementation Roadmap & Timeline
    // ─────────────────────────────────────────────────────────────
    const slide9 = pptx.addSlide();
    addHeader(slide9, '8. Development Roadmap', 9);

    const roadmap = sections.implementationRoadmap || [
      { phase: 'Phase 1: MVP Core', duration: 'Weeks 1-4', details: 'Backend API, Prisma PostgreSQL, search modules.' },
      { phase: 'Phase 2: AI & Synthesis', duration: 'Weeks 5-8', details: 'Sentence-transformers, Gemini 2.5 Flash, React dashboard.' },
      { phase: 'Phase 3: Beta & Scaling', duration: 'Weeks 9-12', details: 'PDF/PPTX exports, auth, public beta launch.' },
    ];

    roadmap.forEach((r, i) => {
      slide9.addShape(pptx.ShapeType.rect, {
        x: 0.8 + i * 3.95, y: 2.0, w: 3.8, h: 4.2,
        fill: { color: 'FFFFFF' }, line: { color: primaryColor, width: 1.5 },
      });
      slide9.addText(r.phase, { x: 1.0 + i * 3.95, y: 2.3, w: 3.4, h: 0.6, fontSize: 16, bold: true, color: primaryColor, align: 'center' });
      slide9.addText(r.duration, { x: 1.0 + i * 3.95, y: 3.0, w: 3.4, h: 0.4, fontSize: 13, bold: true, color: accentColor, align: 'center' });
      slide9.addText(r.details, { x: 1.0 + i * 3.95, y: 3.6, w: 3.4, h: 2.2, fontSize: 12, color: subtextColor });
    });

    // ─────────────────────────────────────────────────────────────
    // SLIDE 10: Future Scope & Team (Dark Background)
    // ─────────────────────────────────────────────────────────────
    const slide10 = pptx.addSlide();
    slide10.background = { color: bgDark };

    slide10.addText('FUTURE SCOPE & VISION', {
      x: 0.8, y: 0.8, w: 11.5, h: 0.4, fontSize: 14, bold: true, color: primaryColor, tracking: 2,
    });

    slide10.addText(`The Future of ${title}`, {
      x: 0.8, y: 1.4, w: 11.5, h: 0.8, fontSize: 32, bold: true, color: textColorLight,
    });

    slide10.addText(sections.futureScope || 'Automated patent filing, enterprise IP defense, and AI-driven venture capital pitch evaluation.', {
      x: 0.8, y: 2.4, w: 11.5, h: 1.5, fontSize: 16, color: 'D1D5DB', lineSpacing: 24,
    });

    slide10.addShape(pptx.ShapeType.line, {
      x: 0.8, y: 4.3, w: 11.7, h: 0, line: { color: '374151', width: 1 },
    });

    slide10.addText('Thank You! Ready for Q&A.', {
      x: 0.8, y: 4.8, w: 11.5, h: 0.6, fontSize: 24, bold: true, color: primaryColor,
    });

    slide10.addText('Built with ProjectPilot AI Engine | hello@projectpilot.ai', {
      x: 0.8, y: 5.6, w: 11.5, h: 0.4, fontSize: 13, color: '9CA3AF',
    });

    // Generate ArrayBuffer and convert to Node Buffer
    const base64Content = await pptx.write({ outputType: 'base64' });
    return Buffer.from(base64Content, 'base64');
  }
}

module.exports = DocumentService;
