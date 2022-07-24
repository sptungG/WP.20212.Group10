const Content = require("./model.content");
const Image = require("../cloudinary/model.image");
const Product = require("../product/model.product");
const Combo = require("../combo/model.combo");
const User = require("../user/model.user");
const { convertToNumber } = require("../../common/utils");

exports.getContentList = async (req, res) => {
  try {
    const { status, onModel, keyword, sort } = req.query;
    let filter = {};
    let sortCondition = {};

    if (status) {
      filter.status = status;
    }
    if (onModel) {
      filter.onModel = onModel;
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
      filter.title = regexCond;
    }

    const foundContents = await Content.find(filter)
      .populate("images", "_id public_id url modelId onModel")
      .populate("createdBy", "_id name picture")
      .sort(sort ? sortCondition : { createdAt: -1 });
    res.status(200).json({
      success: true,
      data: foundContents,
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

exports.getContentByModelId = async (req, res) => {
  try {
    const { modelId } = req.query;
    const foundContent = await Content.findOne({ modelId })
      .populate("images", "_id public_id url modelId onModel")
      .populate("createdBy", "_id name picture");
    res.status(200).json({
      success: true,
      data: foundContent,
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

exports.createContent = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { title, content, images, onModel, modelId } = req.body;
    if (!content || !title || !modelId || !onModel)
      throw { status: 400, message: `Invalid info address updating` };

    let updatedModel = null;
    if (onModel === "Product") {
      updatedModel = await Product.findById(modelId);
    } else if (onModel === "Combo") {
      updatedModel = await Combo.findById(modelId);
    }
    if (!updatedModel) throw { status: 404, message: `Not found ${onModel}:${modelId}` };

    let addedContent = null;
    if (images) {
      const promisesFoundImages = images.map((img) => Image.findById(img));
      let foundImages = await Promise.all(promisesFoundImages);
      foundImages.filter((img) => img?.onModel === "Content");
      addedContent = await new Content({
        title,
        content,
        images,
        onModel,
        modelId,
        createdBy: userId,
      });
      const updateImages = await Promise.all(
        foundImages.map((img) =>
          Image.findByIdAndUpdate(img, { modelId: addedContent._id }, { new: true })
        )
      );
      addedContent.images = updateImages;
      await addedContent.save();
    } else {
      addedContent = await new Content({
        title,
        content,
        images: [],
        onModel,
        modelId,
        createdBy: userId,
      }).save();
    }
    if (addedContent == null) throw { status: 400, message: `Create content failed` };

    if (onModel === "Product") {
      updatedModel = await Product.findByIdAndUpdate(
        modelId,
        { content: addedContent._id },
        { new: true }
      );
    } else if (onModel === "Combo") {
      updatedModel = await Combo.findByIdAndUpdate(
        modelId,
        { content: addedContent._id },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: addedContent,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.updateContentById = async (req, res) => {
  try {
    const { contentId } = req.query;
    const { title, content, images, onModel, modelId } = req.body;
    if (!content || !title || !modelId || !onModel)
      throw { status: 400, message: `Invalid info address updating` };

    let updatedModel = null;
    if (onModel === "Product") {
      updatedModel = await Product.findById(modelId);
    } else if (onModel === "Combo") {
      updatedModel = await Combo.findById(modelId);
    }
    if (!updatedModel) throw { status: 404, message: `Not found ${onModel}:${modelId}` };

    let updatedContent = await Content.findById(contentId);
    if (!updatedContent) throw { status: 404, message: `Not found Content:${contentId}` };

    if (images) {
      const promisesFoundImages = images.map((img) => Image.findById(img));
      let foundImages = await Promise.all(promisesFoundImages);
      foundImages.filter((img) => img?.onModel === "Content");
      const updateImages = await Promise.all(
        foundImages.map((img) =>
          Image.findByIdAndUpdate(img, { modelId: updatedContent._id }, { new: true })
        )
      );
      updatedContent = await Content.findByIdAndUpdate(
        contentId,
        { title, content, images: updateImages, onModel, modelId },
        { new: true }
      );
    } else {
      updatedContent = await Content.findByIdAndUpdate(
        contentId,
        { title, content, onModel, modelId },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: updatedContent,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

exports.removeContent = async (req, res) => {
  try {
    const { contentId } = req.query;

    let removedContent = await Content.findById(contentId);
    if (!removedContent) throw { status: 404, message: `Not found Content:${contentId}` };

    removedContent = await Content.findByIdAndRemove(contentId);

    res.status(200).json({
      success: true,
      data: removedContent,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
