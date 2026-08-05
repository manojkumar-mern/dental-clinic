const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getActivityLogs,
} = require("../controllers/statsController");
const { protectAdmin } = require("../middleware/adminMiddleware");

// All stats endpoints require admin authentication
router.use(protectAdmin);

router.get("/dashboard", getDashboardStats);
router.get("/logs", getActivityLogs);

module.exports = router;
