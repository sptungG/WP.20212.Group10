const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const addressSchema = mongoose.Schema(
  {
    createdBy: { type: ObjectId, ref: "User" },
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
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
