const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck, isAuthenticatedUser } = require("../auth/auth.validation");
// controllers
const {
  addToMyAddressList,
  getMyAddressList,
  removeAddressById,
  updateAddressById,
} = require("./address.controller");
const { getAllUsers, getUser, removeUser, updateUser, updateMyInfo } = require("./user.controller");
// routes
router.get("/user/address_list", authCheck, isAuthenticatedUser, getMyAddressList);
router.get("/user/address_list/:userId", authCheck, isAuthenticatedUser, getMyAddressList);
router.post("/user/address", authCheck, isAuthenticatedUser, addToMyAddressList);
router.put("/user/address", authCheck, isAuthenticatedUser, updateAddressById);
router.delete("/user/address", authCheck, isAuthenticatedUser, removeAddressById);

router.get("/admin/users", authCheck, adminCheck, getAllUsers);
router.get("/admin/user/:userId", authCheck, adminCheck, getUser);
router.put("/user", authCheck, isAuthenticatedUser, updateMyInfo);
router.put("/admin/user/:userId", authCheck, adminCheck, updateUser);
router.delete("/admin/user/:userId", authCheck, adminCheck, removeUser);

module.exports = router;
