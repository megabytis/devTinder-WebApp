const express = require("express");
const { userAuth } = require("../middleware/Auth");
const { connectionRequestModel } = require("../models/connectionRequest");
const { UserModel } = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/connections", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    const foundDocs = await connectionRequestModel.find({
      status: "accepted",
      $or: [{ toUserID: user._id }, { fromUserID: user._id }],
    });
    res.json({
      message: "Connections",
      data: foundDocs,
    });
  } catch (err) {
    next(err);
  }
});

userRouter.get("/user/requests/recieved", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    const foundDocs = await connectionRequestModel
      .find({
        status: "interested",
        toUserID: user._id,
      })
      .populate("fromUserID", ["firstName", "lastName"]);

    res.json({ message: `All requests Recieved.`, data: foundDocs });
  } catch (err) {
    next(err);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    const docs = await UserModel.find({ _id: { $ne: user._id } });
    res.json({ message: `Feeds`, data: docs });
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
