const { ReportService, ReportGeneratorService, DocumentService } = require('../services');
const { catchAsync, sendResponse, AppError } = require('../utils');

/**
 * GET /api/report/:id
 * Retrieve a full analysis report by UUID.
 */
exports.getReport = catchAsync(async (req, res) => {
  const { id } = req.params;

  const report = await ReportService.getReportById(id);

  if (!report) {
    throw new AppError('Report not found.', 404);
  }

  sendResponse(res, 200, 'Report retrieved successfully.', report);
});

/**
 * GET /api/report/:id/pdf
 * Download professional PDF Innovation Validation Report.
 */
exports.exportPdf = catchAsync(async (req, res) => {
  const { id } = req.params;

  let reportData = await ReportService.getReportById(id);

  // If reportId is not in DB or is demo, generate unified report on the fly
  if (!reportData) {
    reportData = await ReportGeneratorService.generateFullReport({
      title: 'ProjectPilot AI Innovation Report',
      description: 'Automated multi-source innovation validation report.',
      domain: 'Software Technology',
    });
    reportData.reportId = id;
  }

  const pdfBuffer = await DocumentService.generatePdfReport(reportData);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="ProjectPilot_Report_${id}.pdf"`);
  res.setHeader('Content-Length', pdfBuffer.length);
  res.status(200).send(pdfBuffer);
});

/**
 * GET /api/report/:id/ppt
 * Download 10-Slide Startup Pitch Deck (.pptx).
 */
exports.exportPpt = catchAsync(async (req, res) => {
  const { id } = req.params;

  let reportData = await ReportService.getReportById(id);

  if (!reportData) {
    reportData = await ReportGeneratorService.generateFullReport({
      title: 'ProjectPilot AI Startup Pitch Deck',
      description: 'Automated startup pitch deck presentation.',
      domain: 'Software Technology',
    });
    reportData.reportId = id;
  }

  const pptxBuffer = await DocumentService.generatePptxDeck(reportData);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  res.setHeader('Content-Disposition', `attachment; filename="ProjectPilot_PitchDeck_${id}.pptx"`);
  res.setHeader('Content-Length', pptxBuffer.length);
  res.status(200).send(pptxBuffer);
});
