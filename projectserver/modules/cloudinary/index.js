const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck, isAuthenticatedUser } = require("../auth/auth.validation");

// controllers
const { adminRemove, adminUpload, userRemove, userUpload, getImageList } = require("./cloudinary.controller");

router.get("/images", authCheck, isAuthenticatedUser, getImageList);
router.post("/uploadimages", authCheck, isAuthenticatedUser, userUpload);
router.delete("/removeimage", authCheck, isAuthenticatedUser, userRemove);
router.post("/admin/uploadimages", authCheck, adminCheck, adminUpload);
router.delete("/admin/removeimage", authCheck, adminCheck, adminRemove);

module.exports = router;
