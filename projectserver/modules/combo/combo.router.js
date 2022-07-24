const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck, isAuthenticatedUser } = require("../auth/auth.validation");
// controllers
const {
  createCombo,
  deleteCombo,
  getComboById,
  getFilteredCombos,
  updateCombo,
  viewCombo,
  commentCombo,
  requestCombo,
  getAllCombos,
} = require("./combo.controller");
// routes
router.post("/combo", authCheck, isAuthenticatedUser, requestCombo);
router.get("/combos", getFilteredCombos);
router.get("/combo/:comboId", getComboById);
router.put("/combo/:comboId/view", viewCombo);
router.post("/combo/:comboId/comment", authCheck, isAuthenticatedUser, commentCombo);

router.get("/admin/combos", authCheck, adminCheck, getAllCombos);
router.post("/admin/combo", authCheck, adminCheck, createCombo);
router.put("/admin/combo/:comboId", authCheck, adminCheck, updateCombo);
router.delete("/admin/combo/:comboId", authCheck, adminCheck, deleteCombo);

module.exports = router;
