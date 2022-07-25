const cloudinary = require("cloudinary").v2;
const Category = require("./model.category");
const Product = require("../product/model.product");
const Variant = require("../product/model.variant");
const Review = require("../reaction/model.review");
const Wishlist = require("../reaction/model.wishlist");
const User = require("../user/model.user");
const Image = require("../cloudinary/model.image");
const Combo = require("../combo/model.combo");
const { vietnameseSlug } = require("../../common/utils");
const { NOT_FOUND_IMG } = require("../../common/constants");

exports.getAllCategory = async (req, res) => {
  try {
    const { sort, keyword } = req.query;
    let filter = {};
    let sortCondition = {};

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
      filter.name = regexCond;
    }

    const categoryList = await Category.find(filter).sort(sort ? sortCondition : { createdAt: -1 });
    const categoryListWithCount = await Promise.all(
      categoryList.map((c) => Product.countDocuments({ category: c._id }))
    );
    const categoryListRes = categoryList.map((c, i) => {
      return {
        _id: c._id,
        name: c.name,
        image: c.image,
        status: c.status,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        products_count: categoryListWithCount[i],
      };
    });
    res.status(200).json({ success: true, data: categoryListRes });
  } catch (err) {
    res.status(400).send({ success: false, err: "Get categories failed" });
  }
};

// exports.getFilteredCategory = async (req, res) => {};

exports.getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findOne({ _id: categoryId, status: "active" }).exec();
    if (!category) throw { status: 404, message: `${categoryId} not found!` };
    const products = await Product.find({ category: categoryId })
      .populate("category", "_id name")
      .populate("images", "_id public_id url modelId onModel")
      .populate("wishlist", "_id name picture")
      .populate("variants", "_id option_label option_name option_value image")
      .exec();
    res.status(200).json({
      success: true,
      category,
      data: products,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const category = await new Category({
      name,
      image: image || NOT_FOUND_IMG,
    }).save();
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    // console.log(err);
    res.status(400).send({ success: false, err: "Create category failed" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, image, status } = req.body;
    const updated = await Category.findOneAndUpdate(
      { _id: categoryId },
      { name, image: image || NOT_FOUND_IMG, status },
      { new: true }
    );
    if (!updated) throw { status: 404, message: `${categoryId} not found!` };
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findOne({ _id: categoryId });
    if (!category) throw { status: 404, message: `${categoryId} not found!` };

    const updatedProducts = await Product.updateMany(
      { category: categoryId },
      { category: null },
      { new: true }
    );
    await Category.findOneAndRemove({ _id: categoryId });
    res
      .status(200)
      .json({ success: true, data: category, extra: [...promisesRes, updatedProducts] });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
