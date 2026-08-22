const express = require('express');
const router = express.Router();
const verifyToken = require('../../middlewares/authMiddleware');
const requireRole = require('../../middlewares/roleMiddleware');

const {
    applyLeave,
    getLeaveHistory,
    getAllLeaves,
    updateLeaveStatus,
    deleteLeave,
    updateLeave
} = require('./leaveController');

// Open to any authenticated user
router.post('/apply-leave', verifyToken, applyLeave);
router.get('/my-leaves/:userId', verifyToken, getLeaveHistory);

// Protected HR-only routes
router.get('/all-leaves', verifyToken, requireRole('hr'), getAllLeaves);
router.put('/update-leave-status', verifyToken, requireRole('hr'), updateLeaveStatus);
router.delete('/:id', verifyToken, requireRole('hr'), deleteLeave);
router.put('/:id', verifyToken, requireRole('hr'), updateLeave);

// Test Route
router.get('/leave-test', (req, res) => res.send("Leave Module Working"));

module.exports = router;
