const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck, isAuthenticatedUser } = require("../auth/auth.validation");
// controllers
const { addProductToCart, getUserCart, removeProductFromCart } = require("./cart.controller");
// routes
router.get("/cart/products", authCheck, isAuthenticatedUser, getUserCart);
router.post("/cart/product", authCheck, isAuthenticatedUser, addProductToCart);
router.delete("/cart/product", authCheck, isAuthenticatedUser, removeProductFromCart);

module.exports = router;
