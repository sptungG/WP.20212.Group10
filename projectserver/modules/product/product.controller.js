const cloudinary = require("cloudinary").v2;
const { convertToNumber, getTotalPage } = require("../../common/utils");
const Product = require("./model.product");
const Variant = require("./model.variant");
const User = require("../user/model.user");
const Wishlist = require("../reaction/model.wishlist");
const Review = require("../reaction/model.review");
const Category = require("../category/model.category");
const Image = require("../cloudinary/model.image");
const Combo = require("../combo/model.combo");
const Content = require("../content/model.content");
const Cart = require("../cart/model.cart");

// getFilteredProducts (pagination, sort, search)
exports.getFilteredProducts = async (req, res) => {
  try {
    const { status, rating, price, color, category, keyword, page, limit, sort } = req.query;
    const currentPage = convertToNumber(page) || 1;

    const limitNumber = convertToNumber(limit) || 4;

    let filter = { status: "active" };
    let sortCondition = {};

    if (status) {
      filter.status = status;
    }

    if (rating) {
      filter.avgRating = {
        $gte: convertToNumber(rating),
        $lte: convertToNumber(rating) > 4 ? 5 : convertToNumber(rating) + 1,
      };
    }

    if (price) {
      let [minPrice, maxPrice] = price.split(",");
      minPrice = convertToNumber(minPrice);
      maxPrice = convertToNumber(maxPrice);
      let priceCondition = {};
      priceCondition["$gte"] = minPrice;
      if (maxPrice > minPrice) priceCondition["$lte"] = maxPrice;
      filter.price = priceCondition;
    }

    if (sort) {
      const [sortField, sortDirection] = sort.split("_");
      if (sortField && sortDirection) {
        sortCondition[sortField] = sortDirection === "desc" ? -1 : 1;
      }
    }

    if (keyword) {
      const regex = new RegExp(`${keyword}`, "i");
      const regexCond = { $regex: regex };
      console.log(regexCond);
      filter["$or"] = [{ name: regexCond }, { desc: regexCond }];
    }

    if (color) {
      const regex = new RegExp(`${color.toLowerCase()}`, "i");
      const regexCond = { $regex: regex };
      const foundVariants = await Variant.find({
        options: { value: regexCond },
      });
      const variantIds = foundVariants.map((v) => v._id);
      filter.variants = { $in: variantIds };
    }

    if (category) {
      const categoryIds = category.split(",");
      filter.category = { $in: categoryIds };
    }

    const [products, totalProduct] = await Promise.all([
      Product.find(filter)
        .populate("category", "_id name")
        .populate("images", "_id public_id url modelId onModel")
        .populate("wishlist", "_id name picture")
        .populate("variants", "_id price quantity options image sold status")
        .populate({
          path: "combos",
          select: "_id name",
          populate: { path: "image", select: "_id public_id url modelId onModel" },
        })
        .skip((currentPage - 1) * limitNumber)
        .limit(limitNumber)
        .sort(sort ? sortCondition : { createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: currentPage,
        limit: limitNumber,
        total: totalProduct,
        totalPage: getTotalPage(totalProduct, limitNumber),
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    // console.log(req.body);
    const { category, images } = req.body;
    const foundCategory = await Category.findById(category);
    if (!foundCategory) throw { status: 404, message: `${category} not found!` };

    const promisesFoundImages = images.map((img) => Image.findById(img));
    let foundImages = await Promise.all(promisesFoundImages);
    foundImages.filter((img) => img?.onModel === "Product");

    const newProduct = await new Product({ ...req.body, category, images: foundImages });
    const updateImages = await Promise.all(
      foundImages.map((img) =>
        Image.findByIdAndUpdate(img, { modelId: newProduct._id }, { new: true })
      )
    );
    newProduct.images = updateImages;
    await newProduct.save();

    res.status(200).json({ success: true, data: newProduct });
  } catch (err) {
    // console.log(err);
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

// Get all products (Admin)  =>   /api/admin/products
exports.getAdminProducts = async (req, res) => {
  try {
    const { keyword, sort } = req.query;
    let filter = {};
    let sortCondition = {};

    if (keyword) {
      const regex = new RegExp(`${keyword}`, "i");
      const regexCond = { $regex: regex };
      console.log(regexCond);
      filter["$or"] = [{ name: regexCond }, { desc: regexCond }];
    }

    if (sort) {
      const [sortField, sortDirection] = sort.split("_");
      if (sortField && sortDirection) {
        sortCondition[sortField] = sortDirection === "desc" ? -1 : 1;
      }
    }

    const products = await Product.find(filter)
      .populate("category", "_id name")
      .populate("images", "_id public_id url modelId onModel")
      .populate("wishlist", "_id name picture")
      .populate("variants", "_id price quantity options image sold status")
      .populate({
        path: "combos",
        select: "_id name",
        populate: { path: "image", select: "_id public_id url modelId onModel" },
      })
      .sort(sort ? sortCondition : { createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

// Get single product details   =>   /api/product/:id
exports.getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const foundProduct = await Product.findById(productId)
      .populate("category", "_id name")
      .populate({
        path: "content",
        select: "_id title content onModel modelId",
        populate: { path: "images", select: "_id public_id url modelId onModel" },
      })
      .populate("images", "_id public_id url modelId onModel")
      .populate("wishlist", "_id name picture")
      .populate("variants", "_id price quantity options image sold status")
      .populate({
        path: "combos",
        select: "_id name",
        populate: { path: "image", select: "_id public_id url modelId onModel" },
      });

    if (!foundProduct) throw { status: 404, message: `${productId} not found!` };

    res.status(200).json({
      success: true,
      data: foundProduct,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

// Update Product   =>   /api/admin/product/:id
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.query;
    const dataUpdate = req.body;

    const foundProduct = await Product.findOne({ _id: productId });
    if (!foundProduct) throw { status: 404, message: `${productId} not found!` };

    const foundCategory = await Category.findById(dataUpdate?.category);
    if (!foundCategory) throw { status: 404, message: `${dataUpdate?.category} not found!` };

    const updatedProduct = await Product.findByIdAndUpdate(productId, dataUpdate, { new: true });

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

// Delete Product   =>   /api/admin/product/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.query;

    const foundProduct = await Product.findOne({ _id: productId });
    if (!foundProduct) throw { status: 404, message: `${productId} not found!` };

    // Deleting images associated with the product
    // const foundImages = await Image.findOneAndRemove({ modelId: productId });
    // const promisesDestroyImage = foundImages.map((image) =>
    //   image ? cloudinary.uploader.destroy(image?.public_id) : null
    // );

    const promisesRes = await Promise.all([
      // ...promisesDestroyImage,
      User.updateMany({}, { $pull: { wishlist_products: productId } }, { new: true }),
      Combo.updateMany({}, { $pull: { products: { product: productId } } }, { new: true }),
      Cart.updateMany({}, { $pull: { products: { product: productId } } }, { new: true }),
      Variant.deleteMany({ product: productId }),
      Wishlist.deleteMany({ modelId: productId }),
      Review.deleteMany({ modelId: productId }),
      Content.deleteMany({ modelId: productId }),
    ]);

    const deletedProduct = await Product.findByIdAndRemove(productId);
    res.status(200).json({ success: true, data: deletedProduct, extra: promisesRes });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.viewProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $inc: { numOfViews: 1 } },
      { new: true }
    );
    if (!updatedProduct) throw { status: 404, message: `${productId} not found!` };
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
