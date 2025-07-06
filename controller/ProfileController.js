const { isEditAllowed, validateEditProfileData } = require("../utils/Helper");

exports.getProfile = async (req, res, next) => {
  try {
    const user = req.user; // User is attached to the request object by the auth middleware
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedUser = req.user;
    console.log("Logged User:", loggedUser);

    Object.keys(req.body).forEach((key) => [(loggedUser[key] = req.body[key])]);
    await loggedUser.save();
    res.json({
      message: `{ ${loggedUser.firstName} Profile updated successfully}`,
      data: loggedUser,
    });
    console.log("Logged User:", loggedUser);
  } catch (err) {
    console.error("Error updating user profile:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};
