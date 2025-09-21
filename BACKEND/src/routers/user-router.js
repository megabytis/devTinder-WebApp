const express = require("express");
const { userAuth } = require("../middleware/Auth");
const { connectionRequestModel } = require("../models/connectionRequest");
const { UserModel } = require("../models/user");

const userRouter = express.Router();

const SAFE_PROPERTIES_TO_SHOW = [
  "firstName",
  "lastName",
  "photoURL",
  "skills",
  "about",
  "age",
];

userRouter.get("/user/connections", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    const foundDocs = await connectionRequestModel
      .find({
        status: "accepted",
        $or: [{ toUserID: user._id }, { fromUserID: user._id }],
      })
      .populate("fromUserID", ["firstName", "lastName"])
      .populate("toUserID", ["firstName", "lastName"]);

    const connectionWithOtherUser = foundDocs.map((doc) => {
      const otherUser =
        doc.fromUserID._id.toString() === user._id.toString()
          ? doc.toUserID
          : doc.fromUserID;

      return otherUser;
    });

    res.json({
      message: "Connections",
      data: connectionWithOtherUser,
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
      .populate("fromUserID", SAFE_PROPERTIES_TO_SHOW);

    res.json({ message: `All requests Recieved.`, data: foundDocs });
  } catch (err) {
    next(err);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res, next) => {
  try {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;

    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 30 ? 30 : limit;

    const skip = (page - 1) * limit;

    const connectionList = await connectionRequestModel
      .find({
        // status: { $in: ["interested", "accepted", "ignored", "rejected"] },
        $or: [{ fromUserID: user._id }, { toUserID: user._id }],
      })
      .select("fromUserID toUserID");

    const notToShowUsersIDsSet = new Set();

    // Adding current user to set, cuz my id also should be ignored, cuz i don't wanna see my profile in feed :)
    notToShowUsersIDsSet.add(user._id.toString());

    // Adding all users of req-model to the set
    for (el of connectionList) {
      notToShowUsersIDsSet.add(el.fromUserID.toString());
      notToShowUsersIDsSet.add(el.toUserID.toString());
    }

    // converting set to array
    const finalExcludeIDsList = [...notToShowUsersIDsSet];

    const docs = await UserModel.find({
      $and: [
        { _id: { $nin: finalExcludeIDsList } },
        { _id: { $ne: user._id } },
      ],
    })
      .select(SAFE_PROPERTIES_TO_SHOW.join(" "))
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Feeds",
      data: docs,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
