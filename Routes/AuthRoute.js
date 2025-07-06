const express = require("express");
const router = express.Router();
const authController = require("../controller/AuthController");
router.post("/register", authController.SignupUser);
router.post("/login", authController.SigninUser);
router.post("/logout", authController.LogoutUser);
module.exports = router;
