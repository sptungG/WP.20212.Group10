const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const Image = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    modelId: { type: ObjectId, refPath: "onModel", default: new ObjectId(), auto: true },
    onModel: {
      type: String,
      required: true,
      enum: ["Combo", "Product", "User", "Content"],
    },
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", Image);
