const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, isAuthenticatedUser, adminCheck } = require("../auth/auth.validation");
// controllers
const {
  createProductReview,
  getAllReviews,
  getFilteredProductReviews,
  getFilteredComboReviews,
  getFilteredReviews,
  removeReview,
} = require("./review.controller");
const {
  getWishlistByUserId,
  toggleProductInWishlist,
  toggleComboInWishlist,
} = require("./wishlist.controller");

// routes
router.post("/review", authCheck, isAuthenticatedUser, createProductReview);
router.get("/reviews", getFilteredReviews);
router.get("/product/:productId/reviews", getFilteredProductReviews);
router.get("/combo/:comboId/reviews", getFilteredComboReviews);
router.get("/admin/reviews", authCheck, adminCheck, getAllReviews);
router.delete("/admin/review", authCheck, adminCheck, removeReview);

router.get("/wishlist", authCheck, isAuthenticatedUser, getWishlistByUserId);
router.put("/wishlist/product", authCheck, isAuthenticatedUser, toggleProductInWishlist);
router.put("/wishlist/combo", authCheck, isAuthenticatedUser, toggleComboInWishlist);

module.exports = router;
