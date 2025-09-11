const express = require("express");
const { userAuth } = require("../middleware/Auth");
const { connectionRequestModel } = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/connections", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    const foundDocs = await connectionRequestModel.find({
      status: "accepted",
      $or: [{ toUserID: user._id }, { fromUserID: user._id }],
    });
    res.send(foundDocs);
  } catch (err) {
    next(err);
  }
});

userRouter.get("/user/requests/recieved", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    const foundDocs = await connectionRequestModel.find({
      status: "interested",
      toUserID: user._id,
    });
    res.send(foundDocs);
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
