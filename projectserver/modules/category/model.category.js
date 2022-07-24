const mongoose = require("mongoose");
const { NOT_FOUND_IMG } = require("../../common/constants");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      text: true,
    },
    image: {
      type: String,
      default: NOT_FOUND_IMG,
    },
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
