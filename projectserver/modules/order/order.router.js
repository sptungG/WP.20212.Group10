const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck, isAuthenticatedUser } = require("../auth/auth.validation");
// controllers
const {
  createOrder,
  getSingleOrder,
  getAllOrders,
  getMyOrders,
  updateOrder,
  deleteOrder,
  createCashOrder,
  cancelMyOrder,
} = require("./order.controller");
const { processPayment, refundPayment } = require("./payment.controller");
// routes
router.get("/orders", authCheck, isAuthenticatedUser, getMyOrders);
router.get("/admin/orders", authCheck, adminCheck, getAllOrders);
router.get("/admin/order/:orderId", authCheck, adminCheck, getSingleOrder);
router.post("/order", authCheck, isAuthenticatedUser, createOrder);
router.post("/order/cancel/:orderId", authCheck, isAuthenticatedUser, cancelMyOrder);
router.post("/order/cod", authCheck, isAuthenticatedUser, createCashOrder);
router.put("/admin/order/:orderId", authCheck, adminCheck, updateOrder);
router.delete("/admin/order/:orderId", authCheck, adminCheck, deleteOrder);

router.post("/refund/:orderId", authCheck, isAuthenticatedUser, refundPayment);
router.post("/create-payment-intent", authCheck, isAuthenticatedUser, processPayment);

module.exports = router;
