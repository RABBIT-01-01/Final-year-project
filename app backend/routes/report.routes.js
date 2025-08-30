const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middlewares/auth.middleware');
const reportController = require('../controllers/report.controller');

// Configure Multer storage for report images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure uploads/reports folder exists
    cb(null, path.join(__dirname, '../uploads/reports/'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `report-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// Routes for Report operations

// Create a new report with an image upload
router.post(
  '/',
  authMiddleware.authUser,
  upload.single('image'),       // handle 'image' file from FormData
  reportController.createReport
);

// Retrieve all reports
router.get(
  '/',
  authMiddleware.authUser,
  reportController.getAllReports
);

// Retrieve a single report by ID
router.get(
  '/:id',
  authMiddleware.authUser,
  reportController.getReportById
);

// Retrieve reports by maintenance_team
router.get(
  '/team/:team',
  authMiddleware.authUser,
  reportController.getReportsByTeam
);


// Update an existing report (optionally replace image)
router.put(
  '/:id',
  upload.single('image'),       // handle new image if provided
  reportController.updateReport
);

// Delete a report by ID
router.delete(
  '/:id',
  authMiddleware.authUser,
  reportController.deleteReport
);

module.exports = router;
