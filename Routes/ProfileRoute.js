const express = require("express");
const router = express.Router();
const {userAuth}= require("../middleware/auth");
const ProfileController = require("../controller/ProfileController");
router.get("/profile/view",userAuth, ProfileController.getProfile);
router.patch("/profile/edit", userAuth, ProfileController.updateProfile)

module.exports = router;
