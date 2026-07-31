const { Router } = require('express');
const { uploadController } = require('../controllers');
const { upload, authenticateToken } = require('../middleware');

const router = Router();

/**
 * POST /api/upload
 * Upload a single document (field name: "document"). Protected route.
 */
router.post('/', authenticateToken, upload.single('document'), uploadController.uploadFile);

module.exports = router;
