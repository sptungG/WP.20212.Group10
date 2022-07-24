const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const UserSchema = mongoose.Schema(
  {
    name: String,
    picture: { type: String, default: "https://source.unsplash.com/random?setup" },
    phone: String,
    email: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: "user",
    },
    defaultAddress: {
      type: ObjectId,
      ref: "Address",
    },
    emailVerified: { type: Boolean, default: false },
    cart: { type: ObjectId, ref: "Cart" },
    history: [{ type: ObjectId, ref: "Order" }],
    wishlist_products: [{ type: ObjectId, ref: "Product" }],
    wishlist_combos: [{ type: ObjectId, ref: "Combo" }],
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
