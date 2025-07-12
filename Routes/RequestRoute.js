const express = require("express");
const router = express.Router();
const { userAuth } = require("../middleware/auth");
const requestController = require("../controller/RequestController");
router.post("/send/:status/:toUserId", userAuth, requestController.SendConnectionRequest);
router.post(
  "/review/:status/:requestId",
  userAuth,
  requestController.ReviewConnectionRequest
);
module.exports = router;
