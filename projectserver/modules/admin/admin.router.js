const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../auth/auth.validation");
// controllers

// routes
router.get("/admin", authCheck, adminCheck, (req, res) => {
  res.json("admin");
});

module.exports = router;
