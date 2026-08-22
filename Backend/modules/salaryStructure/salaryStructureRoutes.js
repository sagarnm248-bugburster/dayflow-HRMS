const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const {
  getGlobalSalaryStructure,
  updateGlobalSalaryStructure,
  calculateSalaryPreview
} = require('./salaryStructureController');

// ✅ GET global salary structure
router.get('/salary-structure', authenticateToken, getGlobalSalaryStructure);

// ✅ UPDATE global salary structure (Admin only)
router.put('/salary-structure', authenticateToken, updateGlobalSalaryStructure);

// ✅ POST preview - calculate salary for wage
router.post('/salary-structure/preview', authenticateToken, calculateSalaryPreview);

module.exports = router;
