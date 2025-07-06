const ConnectionRequest = require("../model/ConnecctionRequest");

const User = require("../model/User");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

exports.RecievedConnectionRequests = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({ message: "fetched Data Successfully", data: connectionRequest });
  } catch (err) {
    req.statusCode(400).send("ERROR: " + err.message);
  }
};
exports.ReviewAllConnection = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { touserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ message: "Fetched All Connection Successfully", data });
  } catch (err) {
    req.status(400).send("ERROR: " + err.message);
  }
};
exports.UserFeed = async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Fetched User Feed Successfully",
      data: users,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};
