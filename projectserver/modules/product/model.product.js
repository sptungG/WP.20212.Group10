const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      text: true,
      trim: true,
      index: true,
    },
    desc: { type: String, trim: true },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    images: [{ type: ObjectId, ref: "Image" }],
    shipping: {
      type: Boolean,
      default: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    numOfViews: {
      type: Number,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    content: { type: ObjectId, ref: "Content" },
    combos: [{ type: ObjectId, ref: "Combo" }],
    wishlist: [{ type: ObjectId, ref: "User" }],
    variants: [{ type: ObjectId, ref: "Variant" }],
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
