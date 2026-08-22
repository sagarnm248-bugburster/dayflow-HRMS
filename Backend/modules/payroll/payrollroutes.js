const express = require("express");
const { GenerateSlip, Addsalaryinfo, Updatesalaryinfo, usersalarybyitsid } = require('./payrollcontroller');
const authenticateToken = require('../../middlewares/authMiddleware');
const requireRole = require('../../middlewares/roleMiddleware');

const router = express.Router();

router.post("/Generate", authenticateToken, requireRole('hr'), GenerateSlip);
router.post("/usersalaryinfo/add", authenticateToken, requireRole('hr'), Addsalaryinfo);
router.put("/usersalaryinfo/update", authenticateToken, requireRole('hr'), Updatesalaryinfo);
router.get("/usersalaryinfo/:id", authenticateToken, requireRole('hr', 'employee'), usersalarybyitsid);

module.exports = router;