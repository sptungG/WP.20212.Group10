const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      name: { type: String, required: true },
      phoneNo: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
        default: "VietNam",
      },
    },
    orderItems: [
      {
        saved_name: {
          type: String,
          required: true,
        },
        saved_quantity: {
          type: Number,
          required: true,
        },
        saved_image: {
          type: String,
          required: true,
        },
        saved_price: {
          type: Number,
          required: true,
        },
        saved_variant: [{ name: String, value: String, auto: false }],
        product: {
          type: ObjectId,
          required: true,
          ref: "Product",
        },
        variant: {
          type: ObjectId,
          required: true,
          ref: "Variant",
        },
      },
    ],
    paymentInfo: {
      id: String,
      status: String,
      payment_method_types: Array,
      amount: String,
      currency: String,
      created: String,
    },
    paidAt: {
      type: Date,
    },
    itemsPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    deliveredAt: {
      type: Date,
    },
    orderStatus: {
      value: { type: String, default: "PROCESSING" },
      name: { type: String, required: true },
    },
    orderLog: [{ createdAt: Date, createdBy: { type: ObjectId, ref: "User" }, content: String }],
    orderNote: { type: String, default: "" },
    createdBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
