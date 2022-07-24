const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck, isAuthenticatedUser } = require("../auth/auth.validation");
// controllers
const {
  createContent,
  getContentByModelId,
  getContentList,
  removeContent,
  updateContentById,
} = require("./content.controller");
// routes
router.get("/contents", getContentList);
router.get("/content", getContentByModelId);
router.post("/admin/content", authCheck, adminCheck, createContent);
router.put("/admin/content", authCheck, adminCheck, updateContentById);
router.delete("/admin/content", authCheck, adminCheck, removeContent);

module.exports = router;
