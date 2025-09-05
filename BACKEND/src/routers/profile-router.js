const express = require("express");

const { userAuth } = require("../middleware/Auth");
const { UserModel } = require("../models/user");
const { validateEditProfileData } = require("../utils/validate");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res, next) => {
  const user = req.user;
  res.send(user);
});

profileRouter.patch(
  "/profile/edit/:userID",
  userAuth,
  async (req, res, next) => {
    try {
      const dataUserWannaModify = req.body;
      const userID = req.params?.userID;

      validateEditProfileData(req);

      await UserModel.findByIdAndUpdate(userID, dataUserWannaModify, {
        runValidators: true,
      });
      res.send("User updated Successfully");
    } catch (err) {
      res.status(400).send(`UPDATE FAILED : ${err.message}`);
    }
  }
);

module.exports = profileRouter;
