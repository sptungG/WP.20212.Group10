const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../auth/auth.validation");
// controllers
const {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} = require("./category.controller");
// routes
router.post("/admin/category", authCheck, adminCheck, createCategory);
router.get("/categories", getAllCategory);
router.get("/category/:categoryId", getCategoryById);
router.put("/admin/category/:categoryId", authCheck, adminCheck, updateCategory);
router.delete("/admin/category/:categoryId", authCheck, adminCheck, deleteCategory);

module.exports = router;
