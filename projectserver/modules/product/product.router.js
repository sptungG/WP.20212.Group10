const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../auth/auth.validation");
// controllers
const {
  getFilteredProducts,
  createProduct,
  getSingleProduct,
  getAdminProducts,
  deleteProduct,
  updateProduct,
  viewProduct,
} = require("./product.controller");

const { createVariant, removeVariant, updateVariant } = require("./variant.controller");

// routes
router.post("/admin/product", authCheck, adminCheck, createProduct);
router.get("/products", getFilteredProducts);
router.get("/admin/products", authCheck, adminCheck, getAdminProducts);
router.get("/product/:productId", getSingleProduct);
router.put("/admin/product", authCheck, adminCheck, updateProduct);
router.put("/product/:productId/view", viewProduct);
router.delete("/admin/product", authCheck, adminCheck, deleteProduct);

router.post("/admin/variant", authCheck, adminCheck, createVariant);
router.put("/admin/variant", authCheck, adminCheck, updateVariant);
router.delete("/admin/variant", authCheck, adminCheck, removeVariant);

module.exports = router;
