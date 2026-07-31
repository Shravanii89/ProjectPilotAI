const { validationResult, body, param } = require('express-validator');
const { AppError } = require('../utils');

/**
 * Runs after express-validator checks.
 * If there are validation errors, throws an AppError with details.
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((e) => e.msg)
      .join('. ');
    return next(new AppError(messages, 422));
  }
  next();
};

// ── Reusable validation chains ──

const authValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.'),
  validate,
];

const analyzeValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required.')
    .isLength({ max: 200 })
    .withMessage('Title must be under 200 characters.'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required.')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters.'),
  body('domain')
    .trim()
    .notEmpty()
    .withMessage('Domain is required.'),
  body('competition')
    .optional()
    .trim()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Competition must be low, medium, or high.'),
  validate,
];

const reportIdValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Report ID is required.'),
  validate,
];

const githubSearchValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required.'),
  body('description')
    .optional()
    .trim(),
  validate,
];

const paperSearchValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required.'),
  body('description')
    .optional()
    .trim(),
  validate,
];

const patentSearchValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required.'),
  body('description')
    .optional()
    .trim(),
  validate,
];

const startupSearchValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required.'),
  body('description')
    .optional()
    .trim(),
  validate,
];

const similaritySearchValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required for similarity calculation.'),
  body('description')
    .optional()
    .trim(),
  validate,
];

module.exports = {
  validate,
  authValidation,
  analyzeValidation,
  reportIdValidation,
  githubSearchValidation,
  paperSearchValidation,
  patentSearchValidation,
  startupSearchValidation,
  similaritySearchValidation,
};
