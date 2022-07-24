const User = require("./model.user");
const Address = require("./model.address");

// getUser
exports.getMyAddressList = async (req, res) => {
  try {
    let userId = null;
    if (req.query.userId) {
      userId = req.query.userId;
    } else {
      userId = req.user._id;
    }
    const foundAddresses = await Address.find({ createdBy: userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: foundAddresses,
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};
// updateUsers
exports.addToMyAddressList = async (req, res) => {
  try {
    const { _id: userId, defaultAddress } = req.user;
    const { name, phoneNo, address, area, city, postalCode, country } = req.body;
    if (!phoneNo || !name || !area || !address || !city || !postalCode || !country)
      throw { status: 400, message: `Invalid info address updating` };
    const addedAddress = await new Address({
      name,
      phoneNo,
      address,
      area,
      city,
      postalCode,
      country,
      createdBy: userId,
    }).save();

    if (!defaultAddress) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { defaultAddress: addedAddress._id },
        { new: true }
      );
    }
    res.status(200).json({
      success: true,
      data: addedAddress,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};
exports.updateAddressById = async (req, res) => {
  try {
    let userId = null;
    if (req.query?.userId) {
      userId = req.query.userId;
    } else {
      userId = req.user._id;
    }
    const { addressId, name, phoneNo, address, area, city, postalCode, country } = req.body;
    if (!phoneNo || !name || !area || !address || !city || !postalCode || !country)
      throw { status: 400, message: `Invalid info address updating` };

    let updatedAddress = await Address.findById(addressId);
    if (!updatedAddress) throw { status: 404, message: `Not found Address:${addressId}` };
    if (updatedAddress.createdBy.toString() !== userId.toString())
      throw { status: 400, message: `Not found Address:${addressId} in your address list` };
    updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { name, phoneNo, address, area, city, postalCode, country },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: updatedAddress,
    });
  } catch (err) {
    res.status(err?.status || 400).json({ success: false, err: err.message });
  }
};

// removeUsers
exports.removeAddressById = async (req, res) => {
  try {
    let userId = null;
    if (req.query?.userId) {
      userId = req.query.userId;
    } else {
      userId = req.user._id;
    }
    const { addressId, exchangeId } = req.body;
    let deletedAddress = await Address.findById(addressId);
    if (!deletedAddress) throw { status: 404, message: `Not found Address:${addressId}` };
    if (deletedAddress.createdBy.toString() !== userId.toString())
      throw { status: 400, message: `Not found Address:${addressId} in your address list` };
    deletedAddress = await Address.findByIdAndRemove(addressId);

    if (defaultAddress.toString() === addressId.toString()) {
      if (exchangeId) {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { defaultAddress: exchangeId },
          { new: true }
        );
      } else {
        const { name, phoneNo, address, area, city, postalCode, country } = req.body;
        if (!phoneNo || !name || !area || !address || !city || !postalCode || !country)
          throw { status: 400, message: `Invalid info address updating` };
        const addedAddress = await new Address({
          name,
          phoneNo,
          address,
          area,
          city,
          postalCode,
          country,
          createdBy: userId,
        }).save();
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { defaultAddress: addedAddress._id },
          { new: true }
        );
      }
    }

    res.status(200).json({
      success: true,
      data: deletedAddress,
    });
  } catch (err) {
    res.status(400).json({ success: false, err: err.message });
  }
};
