const errorHandler = require('./errorHandler');
const {
  validate,
  authValidation,
  analyzeValidation,
  reportIdValidation,
  githubSearchValidation,
  paperSearchValidation,
  patentSearchValidation,
  startupSearchValidation,
  similaritySearchValidation,
} = require('./validation');
const upload = require('./upload');
const { authenticateToken, optionalAuth } = require('./authMiddleware');

module.exports = {
  errorHandler,
  validate,
  authValidation,
  analyzeValidation,
  reportIdValidation,
  githubSearchValidation,
  paperSearchValidation,
  patentSearchValidation,
  startupSearchValidation,
  similaritySearchValidation,
  upload,
  authenticateToken,
  optionalAuth,
};
