const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../auth/auth.validation");
// controllers
const {
  getIncomeStats,
  getUsersStats,
  getProductVariantsStats,
  getStatusStats
} = require("./analytics.controller");
// routes
router.get("/stats/statuses", authCheck, adminCheck, getStatusStats);
router.get("/stats/income", authCheck, adminCheck, getIncomeStats);
router.get("/stats/variants", authCheck, adminCheck, getProductVariantsStats);
router.get("/stats/users", authCheck, adminCheck, getUsersStats);

module.exports = router;
