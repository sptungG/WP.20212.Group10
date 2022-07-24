const User = require("./model.user");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const Product = require("../product/model.product");
const Image = require("../cloudinary/model.image");
const Address = require("./model.address");
const { isValidURL } = require("../../common/utils");

// getAllUsers (non-pagination)
exports.getAllUsers = async (req, res) => {
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
      filter["$or"] = [{ name: regexCond }, { email: regexCond }];
    }

    if (sort) {
      const [sortField, sortDirection] = sort.split("_");
      if (sortField && sortDirection) {
        sortCondition[sortField] = sortDirection === "desc" ? -1 : 1;
      }
    }

    const users = await User.find(filter).sort(sort ? sortCondition : { createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};
// getUser
exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const foundUser = await User.findById(userId);
    res.status(200).json({
      success: true,
      data: foundUser,
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};

// updateUsers
exports.updateMyInfo = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { picture, name, defaultAddress } = req.body;
    let updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (defaultAddress) {
      const foundAddress = await Address.findById(defaultAddress);
      if (!foundAddress) throw { status: 404, message: `Not found address: ${defaultAddress}` };
      updateData.defaultAddress = defaultAddress;
    }
    if (picture) {
      if (!isValidURL(picture)) throw { status: 400, message: `Invalid picture image ${picture}` };
      updateData.picture = picture;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
// updateUsers
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};
// removeUsers
exports.removeUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const foundUser = await User.findOne({ _id: userId });
    if (!foundUser) throw { status: 404, message: `${userId} not found!` };
    if (userId === req.user._id.toString())
      throw { status: 400, message: `You cannot remove yourself!` };

    // Deleting images associated with the product
    const foundImages = await Image.findOneAndRemove({ modelId: userId });
    const promisesDestroyImage = foundImages.map((image) =>
      image ? cloudinary.uploader.destroy(image?.public_id) : null
    );

    const promisesRes = await Promise.all([
      ...promisesDestroyImage,
      Product.updateMany({}, { $pull: { wishlist: userId } }, { new: true }),
      Combo.updateMany({}, { $pull: { wishlist: userId } }, { new: true }),
      Variant.deleteMany({ product: userId }),
      Wishlist.deleteMany({ modelId: userId }),
      Review.deleteMany({ modelId: userId }),
      Address.deleteMany({ createdBy: userId }),
    ]);

    const deletedUser = await User.findByIdAndRemove(userId);
    res.status(200).json({ success: true, data: deletedUser, extra: promisesRes });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
