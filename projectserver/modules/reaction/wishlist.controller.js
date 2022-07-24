const Wishlist = require("./model.wishlist");
const User = require("../user/model.user");
const Combo = require("../combo/model.combo");
const Product = require("../product/model.product");

// getWishlistByUserId
exports.getWishlistByUserId = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { onModel } = req.query;

    const foundProductWishlist = await Wishlist.find({ onModel: "Product", createdBy: userId })
      .populate({
        path: "modelId",
        model: "Product",
        populate: [
          { path: "category", select: "_id name" },
          { path: "images", select: "_id public_id url modelId onModel" },
          { path: "wishlist", select: "_id name picture" },
          { path: "variants", select: "_id price quantity options image sold status" },
        ],
      })
      .sort({ createdAt: -1 });

    const foundComboWishlist = await Wishlist.find({
      onModel: "Combo",
      createdBy: userId,
    })
      .populate({
        path: "modelId",
        model: "Combo",
        populate: [
          { path: "image", select: "_id public_id url modelId onModel" },
          { path: "wishlist", select: "_id name picture" },
          {
            path: "products",
            populate: {
              path: "product",
              model: "Product",
              populate: [
                { path: "category", select: "_id name" },
                { path: "images", select: "_id public_id url modelId onModel" },
                { path: "wishlist", select: "_id name picture" },
                { path: "variants", select: "_id price quantity options image sold status" },
              ],
            },
          },
        ],
      })
      .sort({ createdAt: -1 });

    let foundWishlist = [...foundComboWishlist, ...foundProductWishlist];
    if (onModel === "Product") foundWishlist = foundProductWishlist;
    if (onModel === "Combo") foundWishlist = foundComboWishlist;

    return res.status(200).json({
      success: true,
      data: foundWishlist,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
// toggleProductInWishlist
exports.toggleProductInWishlist = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { productId } = req.query;

    const foundProduct = await Product.findOne({ _id: productId });
    if (!foundProduct) throw { status: 404, message: `${productId} not found!` };
    if (["deleted", "inactive"].includes(foundProduct.status))
      throw { status: 400, message: `${productId} is inactive!` };

    const foundProductInWishlist = await Wishlist.find({
      modelId: productId,
      onModel: "Product",
      createdBy: userId,
    });
    if (foundProductInWishlist.length === 0) {
      const newProductInWishlist = await new Wishlist({
        modelId: productId,
        onModel: "Product",
        createdBy: userId,
      }).save();

      await Promise.all([
        User.findByIdAndUpdate(userId, { $push: { wishlist_products: productId } }, { new: true }),
        Product.findByIdAndUpdate(productId, { $push: { wishlist: userId } }, { new: true }),
      ]);

      return res.status(200).json({
        success: true,
        data: newProductInWishlist,
      });
    } else {
      const [foundWishlist] = foundProductInWishlist;
      const removedProductFromWishlist = await Wishlist.findByIdAndRemove(foundWishlist._id);
      await Promise.all([
        User.findByIdAndUpdate(userId, { $pull: { wishlist_products: productId } }, { new: true }),
        Product.findByIdAndUpdate(productId, { $pull: { wishlist: userId } }, { new: true }),
      ]);
      return res.status(200).json({
        success: true,
        data: removedProductFromWishlist,
      });
    }
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
// toggleComboInWishlist
exports.toggleComboInWishlist = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { comboId } = req.query;

    const foundCombo = await Combo.findOne({ _id: comboId });
    if (!foundCombo) throw { status: 404, message: `${comboId} not found!` };
    if (["deleted", "inactive"].includes(foundCombo.status))
      throw { status: 400, message: `${comboId} is inactive!` };

    const foundComboInWishlist = await Wishlist.find({
      modelId: comboId,
      onModel: "Combo",
      createdBy: userId,
    });
    if (foundComboInWishlist.length === 0) {
      const newProductInWishlist = await new Wishlist({
        modelId: comboId,
        onModel: "Combo",
        createdBy: userId,
      }).save();

      await Promise.all([
        User.findByIdAndUpdate(userId, { $push: { wishlist_combos: comboId } }, { new: true }),
        Combo.findByIdAndUpdate(comboId, { $push: { wishlist: userId } }, { new: true }),
      ]);

      return res.status(200).json({
        success: true,
        data: newProductInWishlist,
      });
    } else {
      const [foundWishlist] = foundComboInWishlist;
      const removedProductFromWishlist = await Wishlist.findByIdAndRemove(foundWishlist._id);
      await Promise.all([
        User.findByIdAndUpdate(userId, { $pull: { wishlist_combos: comboId } }, { new: true }),
        Combo.findByIdAndUpdate(comboId, { $pull: { wishlist: userId } }, { new: true }),
      ]);
      return res.status(200).json({
        success: true,
        data: removedProductFromWishlist,
      });
    }
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
