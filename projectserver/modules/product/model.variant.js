const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const variantSchema = mongoose.Schema(
  {
    product: { type: ObjectId, ref: "Product" },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    quantity: { type: Number, required: true },
    options: [{ name: String, value: String }],
    image: { type: ObjectId, ref: "Image" },
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Variant", variantSchema);
