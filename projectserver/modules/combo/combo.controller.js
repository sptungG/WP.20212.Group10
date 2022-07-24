const Combo = require("./model.combo");
const Product = require("../product/model.product");
const Image = require("../cloudinary/model.image");
const User = require("../user/model.user");
const Wishlist = require("../reaction/model.wishlist");
const Review = require("../reaction/model.review");
const Content = require("../content/model.content");
const { NOT_FOUND_IMG } = require("../../common/constants");
const { convertToNumber, getTotalPage } = require("../../common/utils");

exports.getAllCombos = async (req, res) => {
  try {
    const { keyword, sort, status } = req.query;

    let filter = {};
    let sortCondition = {};

    if (status) {
      filter.status = status;
    }

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

    const combos = await Combo.find(filter)
      .populate([
        { path: "image", select: "_id public_id url modelId onModel" },
        { path: "wishlist", select: "_id name picture" },
        { path: "createdBy", select: "_id name picture" },
        {
          path: "comments",
          populate: {
            path: "createdBy",
            select: "_id name picture",
          },
        },
      ])
      .sort(sort ? sortCondition : { createdAt: -1 });

    res.status(200).json({
      success: true,
      data: combos,
    });
  } catch (err) {
    res.status(400).send({ success: false, err: "Get combos failed" });
  }
};

exports.getFilteredCombos = async (req, res) => {
  try {
    const { keyword, page, limit, sort } = req.query;
    const currentPage = convertToNumber(page) || 1;
    const limitNumber = convertToNumber(limit) || 4;

    let filter = { status: "active" };
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

    const [combos, totalCombos] = await Promise.all([
      Combo.find(filter)
        .populate([
          { path: "image", select: "_id public_id url modelId onModel" },
          { path: "wishlist", select: "_id name picture" },
          { path: "createdBy", select: "_id name picture" },
          {
            path: "comments",
            populate: {
              path: "createdBy",
              select: "_id name picture",
            },
          },
        ])
        .skip((currentPage - 1) * limitNumber)
        .limit(limitNumber)
        .sort(sort ? sortCondition : { createdAt: -1 }),
      Combo.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: combos,
      pagination: {
        page: currentPage,
        limit: limitNumber,
        total: totalCombos,
        totalPage: getTotalPage(totalCombos, limitNumber),
      },
    });
  } catch (err) {
    res.status(400).send({ success: false, err: "Get combos failed" });
  }
};

// exports.getFilteredCategory = async (req, res) => {};

exports.getComboById = async (req, res) => {
  try {
    const { comboId } = req.params;
    const foundCombo = await Combo.findOne({ _id: comboId })
      .populate([
        { path: "image", select: "_id public_id url modelId onModel" },
        { path: "wishlist", select: "_id name picture" },
        { path: "createdBy", select: "_id name picture" },
        {
          path: "comments",
          populate: {
            path: "createdBy",
            select: "_id name picture",
          },
        },
        {
          path: "content",
          select: "_id title content onModel modelId",
          populate: { path: "images", select: "_id public_id url modelId onModel" },
        },
        {
          path: "products",
          populate: {
            path: "product",
            model: "Product",
            populate: [
              { path: "category", select: "_id name" },
              { path: "images", select: "_id public_id url modelId onModel" },
              { path: "wishlist", select: "_id name picture" },
              { path: "variants", select: "_id option_label option_name option_value image" },
            ],
          },
        },
      ])
      .exec();
    if (!foundCombo) throw { status: 404, message: `${comboId} not found!` };
    res.status(200).json({
      success: true,
      data: foundCombo,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.requestCombo = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { name, desc, image } = req.body;

    const foundImage = await Image.findById(image);
    if (!foundImage) throw { status: 404, message: `Image:${image} not found!` };

    const newCombo = await new Combo({
      name,
      desc,
      image,
      products: [],
      comments: [],
      createdBy: userId,
      status: "inactive",
    });
    const updateImage = await Image.findByIdAndUpdate(
      image,
      { modelId: newCombo._id, onModel: "Combo" },
      { new: true }
    );
    newCombo.image = updateImage;
    await newCombo.save();

    res.status(200).json({ success: true, data: newCombo });
  } catch (err) {
    // console.log(err);
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.createCombo = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { name, desc, image, products, status } = req.body;
    const productIds = products.map((p) => p.product);

    const foundProducts = await Product.find({ _id: { $in: productIds } });
    if (foundProducts.length === 0) throw { status: 404, message: `Products not found!` };

    const foundImage = await Image.findById(image);
    if (!foundImage) throw { status: 404, message: `Image:${image} not found!` };

    const newCombo = await new Combo({
      name,
      desc,
      image,
      products,
      comments: [],
      createdBy: userId,
      status,
    });
    const updateImage = await Image.findByIdAndUpdate(
      image,
      { modelId: newCombo._id, onModel: "Combo" },
      { new: true }
    );
    newCombo.image = updateImage;
    await newCombo.save();

    await Product.updateMany(
      { _id: { $in: productIds } },
      { $push: { combos: newCombo._id } },
      { new: true }
    );
    res.status(200).json({ success: true, data: newCombo });
  } catch (err) {
    // console.log(err);
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.commentCombo = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { comboId } = req.params;
    const { content } = req.body;
    let foundCombo = await Combo.findOne({ _id: comboId });
    if (!foundCombo) throw { status: 404, message: `Combo:${comboId} not found!` };
    if (foundCombo.status === "inactive")
      throw { status: 404, message: `Combo:${comboId} is inactive!` };

    const updatedCombo = await Combo.findOneAndUpdate(
      { _id: comboId },
      {
        $push: {
          comments: {
            content,
            createdBy: userId,
          },
        },
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedCombo });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.updateCombo = async (req, res) => {
  try {
    const { comboId } = req.params;
    const { name, desc, image, products = [], status } = req.body;
    let foundCombo = await Combo.findOne({ _id: comboId });
    if (!foundCombo) throw { status: 404, message: `Combo:${comboId} not found!` };

    if (image) {
      const foundImage = await Image.findById(image);
      if (!foundImage) throw { status: 404, message: `Image:${image} not found!` };
    }
    if (products) {
      const oldComboProducts = foundCombo.products;
      const productIds = products.map((p) => p.product);
      const diffIds = productIds.filter(
        (p) => !oldComboProducts.find((item) => p.toString() === item.product.toString())
      );

      if (diffIds.length > 0) {
        await Promise.all([
          Product.updateMany(
            { _id: { $in: diffIds }, combos: { $in: [comboId] } },
            { $pull: { combos: comboId } },
            { new: true }
          ),
          Product.updateMany(
            { _id: { $in: diffIds }, combos: { $nin: [comboId] } },
            { $push: { combos: comboId } },
            { new: true }
          ),
        ]);
      }
    }

    const updatedCombo = await Combo.findOneAndUpdate(
      { _id: comboId },
      { name, desc, image, products, status },
      { new: true }
    );

    if (status === "active") {
      const updateImage = await Image.findByIdAndUpdate(
        updatedCombo.image,
        { status: "active" },
        { new: true }
      );
    }

    res.status(200).json({ success: true, data: updatedCombo });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.deleteCombo = async (req, res) => {
  try {
    const { comboId } = req.params;
    const removedCombo = await Combo.findOne({ _id: comboId });
    if (!removedCombo) throw { status: 404, message: `${comboId} not found!` };
    const productIds = removedCombo.products.map((p) => p.product);

    const promisesRes = await Promise.all([
      Image.findOneAndRemove({ _id: removedCombo.image._id }),
      cloudinary.uploader.destroy(removedCombo.image.public_id),
      User.updateMany({}, { $pull: { wishlist_combos: comboId } }, { new: true }),
      Product.updateMany(
        { _id: { $in: productIds } },
        { $pull: { combos: comboId } },
        { new: true }
      ),
      Wishlist.deleteMany({ modelId: comboId }),
      Review.deleteMany({ modelId: comboId }),
      Content.deleteMany({ modelId: comboId }),
    ]);
    await Combo.findOneAndRemove({ _id: comboId });
    res.status(200).json({ success: true, data: removedCombo, extra: promisesRes });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.viewCombo = async (req, res) => {
  try {
    const { comboId } = req.params;

    const updatedCombo = await Combo.findByIdAndUpdate(
      comboId,
      { $inc: { numOfViews: 1 } },
      { new: true }
    );
    if (!updatedCombo) throw { status: 404, message: `${comboId} not found!` };
    res.status(200).json({ success: true, data: updatedCombo });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
