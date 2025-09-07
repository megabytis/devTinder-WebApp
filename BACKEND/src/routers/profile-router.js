const express = require("express");

const { userAuth } = require("../middleware/Auth");
const { UserModel } = require("../models/user");
const { validateEditProfileData } = require("../utils/validate");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res, next) => {
  const user = req.user;
  res.send(user);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res, next) => {
  try {
    const loggenInUser = req.user;
    const dataUserWannaModify = req.body;
    const userID = loggenInUser._id;

    validateEditProfileData(req);

    // await UserModel.findByIdAndUpdate(userID, dataUserWannaModify, {
    //   runValidators: true,
    // });
    // ----------OR------------
    Object.keys(dataUserWannaModify).forEach((key) => {
      loggenInUser[key] = dataUserWannaModify[key];
    });

    await loggenInUser.save();

    res.json({
      message: ` ${loggenInUser.firstName}, your profile updated Successfully`,
      data: loggenInUser,
    });
  } catch (err) {
    res.status(400).send(`UPDATE FAILED : ${err.message}`);
  }
});

module.exports = profileRouter;
