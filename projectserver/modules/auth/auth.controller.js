const User = require("../user/model.user");

exports.createOrUpdateUser = async (req, res) => {
  const { name, picture, email, phone, email_verified } = req.user;

  const user = await User.findOneAndUpdate(
    { email },
    { name, phone, emailVerified: email_verified },
    { new: true }
  );

  if (user) {
    // console.log("USER UPDATED", user);
    res.status(200).json(user);
  } else {
    const newUser = await new User({
      email,
      phone: phone,
      name: name ?? email.split("@")[0],
      picture: picture ?? "https://source.unsplash.com/random?setup",
      emailVerified: email_verified,
    }).save();
    // console.log("USER CREATED", newUser);
    res.status(200).json(newUser);
  }
};

exports.currentUser = async (req, res) => {
  const { email } = req.user;
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.status(404).json({ success: false, err: `${email} not found!` });
  if (["deleted", "inactive"].includes(foundUser.status))
    return res.status(401).json({ success: false, err: `${email} is inactive user` });
  res.status(200).json(foundUser);
};
