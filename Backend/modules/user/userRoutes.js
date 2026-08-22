const express = require('express');
const { getProfile, addUser, alluser, userByitsId, updateProfile } = require('./userController');
const authenticateToken = require('../../middlewares/authMiddleware');
const requireRole = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/update/:userId', authenticateToken, requireRole('hr'), updateProfile);
router.post('/add', authenticateToken, requireRole('hr'), addUser);
router.get('/all', authenticateToken, requireRole('hr'), alluser);
router.get('/users/:userid', authenticateToken, userByitsId);

module.exports = router;
