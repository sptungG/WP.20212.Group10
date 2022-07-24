const Cart = require("./model.cart");
const Product = require("../product/model.product");
const Variant = require("../product/model.variant");
const User = require("../user/model.user");
const { convertToNumber } = require("../../common/utils");
const lodash = require("lodash");

exports.addProductToCart = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { productId, variantId, quantity } = req.body;
    let quantityNumber = convertToNumber(quantity);
    const foundProduct = await Product.findById(productId);
    const foundVariant = await Variant.findById(variantId);
    if (!foundProduct) throw { status: 404, message: `Product:${productId} not found!` };
    if (!foundVariant) throw { status: 404, message: `Variant:${variantId} not found!` };
    if (!foundProduct.variants.find((v) => v.toString() === variantId))
      throw { status: 400, message: `Variant:${variantId} not in Product:${productId}!` };
    if (foundVariant.quantity < quantityNumber)
      throw {
        status: 400,
        message: `Exceed maximum quantity ${foundVariant.quantity} of Variant:${variantId}!`,
      };

    let newCart = null;
    const foundCart = await Cart.findOne({ createdBy: userId });
    if (!foundCart) {
      // ko tìm thấy cart -> tạo cart mới,gán vào user
      newCart = await new Cart({
        products: [
          {
            product: productId,
            variant: variantId,
            count: quantityNumber,
            price: foundVariant.price,
          },
        ],
        cartTotal: foundVariant.price * quantityNumber,
        createdBy: userId,
      }).save();
    } else {
      // tìm thấy cart -> kiểm tra trùng product, variant trong cart
      const foundProductInCart = foundCart.products.find(
        (p) => p.product.toString() === productId && p.variant.toString() === variantId
      );
      if (!foundProductInCart) {
        // nếu ko trùng -> thêm product vào cart
        const newProduct = {
          product: productId,
          variant: variantId,
          count: quantityNumber,
          price: foundVariant.price,
        };
        newCart = await Cart.findByIdAndUpdate(
          foundCart._id,
          {
            $push: { products: newProduct },
            $inc: { cartTotal: newProduct.price * quantityNumber },
          },
          { new: true }
        );
      } else {
        // nếu trùng -> cập nhật giá trị(count) của product đó trong cart
        const newProducts = foundCart.products.map((p) => {
          if (p.product.toString() === productId && p.variant.toString() === variantId) {
            return { ...p, count: (p.count += quantityNumber) };
          }
          return p;
        });
        newCart = await Cart.findByIdAndUpdate(
          foundCart._id,
          {
            $set: { products: newProducts },
            $inc: { cartTotal: foundVariant.price * quantityNumber },
          },
          { new: true }
        );
      }
    }
    if (newCart == null) throw { status: 400, message: `Failed to add Product:${productId}!` };

    const updatedVariantProduct = await Variant.findByIdAndUpdate(
      variantId,
      { $inc: { quantity: -quantityNumber } },
      { new: true }
    );
    const updatedUser = await User.findByIdAndUpdate(userId, { cart: newCart._id }, { new: true });
    res.status(200).json({ success: true, data: newCart, extra: updatedUser });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const foundCart = await Cart.findOne({ createdBy: userId }).populate([
      {
        path: "products",
        populate: [
          {
            path: "product",
            model: "Product",
            populate: [
              { path: "category", select: "_id name" },
              { path: "images", select: "_id public_id url modelId onModel" },
              { path: "wishlist", select: "_id name picture" },
            ],
          },
          { path: "variant", select: "_id price quantity options image sold status" },
        ],
      },
    ]);
    res.status(200).json({ success: true, data: foundCart });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.removeProductFromCart = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { productId, variantId } = req.body;
    const foundProduct = await Product.findById(productId);
    const foundVariant = await Variant.findById(variantId);
    if (!foundProduct) throw { status: 404, message: `Product:${productId} not found!` };
    if (!foundVariant) throw { status: 404, message: `Variant:${variantId} not found!` };

    const foundCart = await Cart.findOne({ createdBy: userId });
    if (!foundCart) throw { status: 404, message: `Cart:${userId} not found!` };

    const foundProductInCart = foundCart.products.find(
      (p) => p.product.toString() === productId && p.variant.toString() === variantId
    );
    if (foundProductInCart) {
      const updatedCart = await Cart.findOneAndUpdate(
        { _id: foundCart._id },
        {
          $pull: {
            products: {
              product: productId,
              variant: variantId,
            },
          },
          $inc: { cartTotal: -(foundProductInCart.price * foundProductInCart.count) },
        },
        { new: true }
      );
      const updatedVariantProduct = await Variant.findByIdAndUpdate(
        foundProductInCart.variant,
        { $inc: { quantity: foundProductInCart.count } },
        { new: true }
      );
      res.status(200).json({ success: true, data: updatedCart });
    } else
      throw {
        status: 404,
        message: `Product:${productId}-Variant:${variantId} not found in Cart:${userId}!`,
      };
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
