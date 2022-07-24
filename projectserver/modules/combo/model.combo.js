const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ComboSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      text: true,
    },
    desc: String,
    numOfViews: {
      type: Number,
      default: 0,
    },
    wishlist: [{ type: ObjectId, ref: "User" }],
    image: { type: ObjectId, ref: "Image" },
    products: [
      {
        product: { type: ObjectId, ref: "Product" },
        position: { type: String, trim: true, default: "50%,50%" },
      },
    ],
    comments: [
      {
        createdBy: { type: ObjectId, ref: "User" },
        content: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
    content: { type: ObjectId, ref: "Content" },
    createdBy: { type: ObjectId, ref: "User" },
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Combo", ComboSchema);
