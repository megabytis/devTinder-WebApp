const express = require("express");
const { userAuth } = require("../middleware/Auth");

const reqRouter = express.Router();

reqRouter.post(
  "/request/send/interested/:userID",
  userAuth,
  (req, res, next) => {
    const user = req.user;
    const userID = req.params?.userID;

    if (JSON.stringify(userID) === JSON.stringify(user._id)) {
      res.send(`${user.firstName} sent the connection request!`);
    } else {
      throw new Error("invalid credntial!");
    }
  }
);

module.exports = reqRouter;
