const Review = require("./model.review");
const Product = require("../product/model.product");
const User = require("../user/model.user");
const Combo = require("../combo/model.combo");
const { convertToNumber, getTotalPage } = require("../../common/utils");

// getAllReviews (non-pagination)
exports.getAllReviews = async (req, res) => {
  try {
    const { sort, rating, onModel } = req.query;

    let filter = {};
    let sortCondition = {};

    if (onModel) filter.onModel = onModel;

    if (rating) {
      filter.rating = {
        $gte: convertToNumber(rating),
        $lte: convertToNumber(rating) > 4 ? 5 : convertToNumber(rating) + 1,
      };
    }

    if (sort) {
      const [sortField, sortDirection] = sort.split("_");
      if (sortField && sortDirection) {
        sortCondition[sortField] = sortDirection === "desc" ? -1 : 1;
      }
    }

    const reviews = await Review.find(filter)
      .populate("modelId", "_id name")
      .populate("createdBy", "_id name picture")
      .sort(sort ? sortCondition : { createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      err: "Get reviews failed",
    });
  }
};
// getFilteredReviews (pagination, sort)
exports.getFilteredReviews = async (req, res) => {
  try {
    const { page, limit, sort, rating, onModel, createdBy } = req.query;
    const currentPage = convertToNumber(page) || 1;

    const limitNumber = convertToNumber(limit) || 4;

    let filter = {};
    let sortCondition = {};

    if (onModel) filter.onModel = onModel;

    if (rating) {
      filter.rating = {
        $gte: convertToNumber(rating),
        $lte: convertToNumber(rating) > 4 ? 5 : convertToNumber(rating) + 1,
      };
    }

    if (sort) {
      const [sortField, sortDirection] = sort.split("_");
      if (sortField && sortDirection) {
        sortCondition[sortField] = sortDirection === "desc" ? -1 : 1;
      }
    }

    if (createdBy) {
      filter.createdBy = createdBy;
    }

    const [reviews, totalReview] = await Promise.all([
      Review.find(filter)
        .populate("modelId", "_id name")
        .populate("createdBy", "_id name picture")
        .skip((currentPage - 1) * limitNumber)
        .limit(limitNumber)
        .sort(sort ? sortCondition : { createdAt: -1 }),
      Review.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page: currentPage,
        limit: limitNumber,
        total: totalReview,
        totalPage: getTotalPage(totalReview, limitNumber),
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      err: "Get reviews failed",
    });
  }
};
// getFilteredReviews (productIds, pagination)
exports.getFilteredProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, page, limit, sort } = req.query;
    const currentPage = convertToNumber(page) || 1;
    const limitNumber = convertToNumber(limit) || 4;

    let filter = { modelId: productId, onModel: "Product" };
    let sortCondition = {};

    if (sort) {
      const [sortField, sortDirection] = sort.split("_");
      if (sortField && sortDirection) {
        sortCondition[sortField] = sortDirection === "desc" ? -1 : 1;
      }
    }

    if (rating) {
      filter.rating = {
        $gte: convertToNumber(rating),
        $lte: convertToNumber(rating) > 4 ? 5 : convertToNumber(rating) + 1,
      };
    }

    const [reviews, reviewers, totalReview] = await Promise.all([
      Review.find(filter)
        .populate("modelId", "_id name")
        .populate("createdBy", "_id name picture")
        .skip((currentPage - 1) * limitNumber)
        .limit(limitNumber)
        .sort(sort ? sortCondition : { createdAt: -1 }),
      Review.find({ modelId: productId, onModel: "Product" })
        .populate("createdBy", "_id name picture")
        .sort(sort ? sortCondition : { createdAt: -1 }),
      Review.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      reviewers: reviewers,
      data: reviews,
      pagination: {
        page: currentPage,
        limit: limitNumber,
        total: totalReview,
        totalPage: getTotalPage(totalReview, limitNumber),
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      err: "Get reviews failed",
    });
  }
};
// getFilteredReviews (productIds, pagination)
exports.getFilteredComboReviews = async (req, res) => {
  try {
    const { comboId } = req.params;
    const { rating, page, limit, sort } = req.query;
    const currentPage = convertToNumber(page) || 1;
    const limitNumber = convertToNumber(limit) || 4;

    let filter = { modelId: comboId, onModel: "Combo" };
    let sortCondition = {};

    if (sort) {
      const [sortField, sortDirection] = sort.split("_");
      if (sortField && sortDirection) {
        sortCondition[sortField] = sortDirection === "desc" ? -1 : 1;
      }
    }

    if (rating) {
      filter.rating = {
        $gte: convertToNumber(rating),
        $lte: convertToNumber(rating) > 4 ? 5 : convertToNumber(rating) + 1,
      };
    }

    const [reviews, reviewers, totalReview] = await Promise.all([
      Review.find(filter)
        .populate("modelId", "_id name")
        .populate("createdBy", "_id name picture")
        .skip((currentPage - 1) * limitNumber)
        .limit(limitNumber)
        .sort(sort ? sortCondition : { createdAt: -1 }),
      Review.find({ modelId: comboId, onModel: "Combo" })
        .populate("createdBy", "_id name picture")
        .sort(sort ? sortCondition : { createdAt: -1 }),
      Review.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      reviewers: reviewers.map((r) => r.createdBy),
      data: reviews,
      pagination: {
        page: currentPage,
        limit: limitNumber,
        total: totalReview,
        totalPage: getTotalPage(totalReview, limitNumber),
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      err: "Get reviews failed",
    });
  }
};
// createProductReview
exports.createProductReview = async (req, res) => {
  try {
    const { _id: userId, name, picture } = req.user;
    const { productId, comboId } = req.query;
    const { rating, comment } = req.body;

    let model = {
      modelId: "",
      onModel: "",
    };
    if (productId) {
      model.modelId = productId;
      model.onModel = "Product";
    }
    if (comboId) {
      model.modelId = comboId;
      model.onModel = "Combo";
    }

    let foundModel = null;
    if (productId) foundModel = await Product.findOne({ _id: productId });
    if (comboId) foundModel = await Combo.findOne({ _id: comboId });
    if (!foundModel) throw { status: 404, message: `${model.modelId} not found!` };

    const foundModelReview = await Review.find({
      modelId: model.modelId,
      onModel: model.onModel,
      createdBy: userId,
      status: "active",
    });

    if (foundModelReview.length > 0)
      throw { status: 400, message: `${model.modelId} has been already reviewed!` };

    const reviewData = {
      modelId: model.modelId,
      onModel: model.onModel,
      createdBy: userId,
      rating: Number(rating),
      comment,
    };

    const newReview = await new Review(reviewData).save();
    const reviewList = await Review.find({ modelId: model.modelId, onModel: model.onModel });

    const avgRating =
      reviewList.length > 0
        ? reviewList.reduce((currentValue, nextValue) => nextValue.rating + currentValue, 0) /
          reviewList.length
        : 0;

    let updatedModel = null;
    if (productId)
      updatedModel = await Product.findByIdAndUpdate(
        productId,
        {
          avgRating,
          numOfReviews: reviewList.length,
        },
        { new: true }
      );
    if (comboId)
      updatedModel = await Combo.findByIdAndUpdate(
        comboId,
        {
          avgRating,
          numOfReviews: reviewList.length,
        },
        { new: true }
      );

    res.status(200).json({
      success: true,
      reviewer: { name, picture },
      data: newReview,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

// [ADMIN] removeReview
exports.removeReview = async (req, res) => {
  try {
    const { reviewId } = req.query;

    // const foundModel = await Product.findOne({ _id: productId });
    // if (!foundModel) throw { status: 404, message: `${productId} not found!` };

    // const foundModelReview = await Review.find({
    //   product: productId,
    //   createdBy: userId,
    // });

    // const { _id: reviewId } = foundModelReview[0];

    const foundModelReview = await Review.findById(reviewId);
    if (!foundModelReview)
      throw {
        status: 404,
        message: `Review:${reviewId} not found!`,
      };

    const deletedReview = await Review.findOneAndRemove({ _id: reviewId });

    const reviewList = await Review.find({
      modelId: foundModelReview.modelId,
      onModel: foundModelReview.onModel,
    });

    const numOfReviews = reviewList.length;

    const avgRating =
      numOfReviews > 0
        ? reviewList.reduce((currentValue, nextValue) => nextValue.rating + currentValue, 0) /
          reviewList.length
        : 0;

    let updatedModel = null;
    if (foundModelReview.onModel === "Product") {
      updatedModel = await Product.findByIdAndUpdate(
        foundModelReview.modelId,
        {
          avgRating,
          numOfReviews,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    }
    if (foundModelReview.onModel === "Combo") {
      updatedModel = await Combo.findByIdAndUpdate(
        foundModelReview.modelId,
        {
          avgRating,
          numOfReviews,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    }

    res.status(200).json({
      success: true,
      data: deletedReview,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
