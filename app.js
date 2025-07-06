require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const AuthRoute = require("./Routes/AuthRoute");
const ProfileRoute = require("./Routes/ProfileRoute");
const RequestRoute = require("./Routes/RequestRoute");
const UserRoute = require("./Routes/UserRoute");
const PORT = 8000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", AuthRoute);
app.use("/api/profile", ProfileRoute);
app.use("/api/request", RequestRoute);
app.use("/api/user", UserRoute);
mongoose
  .connect(process.env.MONGOOSE_URL)
  .then((result) => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
