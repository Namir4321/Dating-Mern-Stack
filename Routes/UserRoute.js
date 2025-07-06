const express = require("express");
const router = express.Router();
const { userAuth } = require("../middleware/auth");
const userController = require("../controller/UserController");
router.get(
  "/user/request/received",
  userAuth,
  userController.RecievedConnectionRequests
);
router.get(
  "/user/connections",
  userAuth,
  userController.ReviewAllConnection
);
router.get(
  "/user/feed",
  userAuth,
  userController.UserFeed
);

module.exports = router;
