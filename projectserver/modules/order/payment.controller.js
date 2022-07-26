const Cart = require("../cart/model.cart");
const Order = require("../order/model.order");
const User = require("../user/model.user");
const stripe = require("stripe")(process.env.STRIPE_SECRET || "sk_test_");
// https://stripe.com/docs/payments/quickstart
exports.processPayment = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const foundCart = await Cart.findOne({ createdBy: userId });
    if (!foundCart) throw { status: 404, message: `Not found cart with Id:${userId}!` };
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: (foundCart.cartTotal + foundCart.products.length) * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: { integration_check: "accept_a_payment" },
    });

    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
// https://stripe.com/docs/api/refunds/create
exports.refundPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const foundOrder = await Order.findById(orderId);
    if (!foundOrder) throw { status: 404, message: `Not found order with Id:${orderId}!` };
    if (String(foundOrder.paymentInfo.status).toUpperCase() === "COD")
      throw { status: 400, message: `Action denied since OrderId:${orderId} is COD payment!` };
    //
    const refund = await stripe.refunds.create({
      payment_intent: foundOrder.paymentInfo.id,
      amount: foundOrder.paymentInfo.amount * 100,
      reason: "requested_by_customer",
    });

    res.status(200).json({
      success: true,
      status: refund.status,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
