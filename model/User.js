const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    age: {
      type: Number,
      min: 18,
    },
    photoUrl: {
      type: String,
      default: "https://example.com/default-profile.png",
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    {
      _id: user._id,
    },
    "secret key",
    { expiresIn: "24hr" }
  );
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema);
