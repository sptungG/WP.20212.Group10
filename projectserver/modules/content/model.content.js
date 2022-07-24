const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    images: [{ type: ObjectId, ref: "Image" }],
    modelId: { type: ObjectId, refPath: "onModel", default: new ObjectId(), auto: true },
    onModel: {
      type: String,
      required: true,
      enum: ["Combo", "Product"],
    },
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
    createdBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
