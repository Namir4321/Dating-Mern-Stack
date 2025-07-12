const ConnectionRequest = require("../model/ConnecctionRequest");
const User = require("../model/User");
exports.SendConnectionRequest = async (req, res, next) => {
  try {
    console.log("send connection request");

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
  console.log(fromUserId, toUserId, status);
    const allowedStatuses = ["interested", "ignored"];
    if (!allowedStatuses.includes(status)) {
      console.log(status)
      return res.status(400).json({ error: "Invalid status type" + status });
    }
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserd: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ error: "Connection request already exists" });
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    res.json({
      message:
        req.user.firstName +
        " sent a connection request to " +
        toUser.firstName,
      data,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.ReviewConnectionRequest = async (req, res, next) => {
  

  try {
    const loggedInUser = req.user;
    const { requestId, status } = req.params;
    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(req.params.status)) {
      return res
        .status(400)
        .json({ error: "Invalid status type" + req.params.status });
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({ error: "Connection request not found" });
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({
      message: `You have ${status} the connection request from ${connectionRequest.fromUserId.firstName}`,
      data,
    });
  } catch (err) {
    console.log(err)
  }
};
