const express = require("express");

const { userAuth } = require("../middleware/Auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res, next) => {
  const user = req.user;
  res.send(user);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res, next) => {
  const data = req.body;
  const userID = req.params?.userID;

  try {
    const ALLOWED_UPDATES_LIST = [
      "firstName",
      "lastName",
      "age",
      "photoURL",
      "skills",
      "about",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES_LIST.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update now allowed !");
    }

    await UserModel.findByIdAndUpdate(userID, data, {
      runValidators: true,
    });
    res.send("User updated Successfully");
  } catch (err) {
    res.status(400).send(`UPDATE FAILED : ${err.message}`);
  }
});

module.exports = profileRouter;
