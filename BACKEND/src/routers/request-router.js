const express = require("express");
const { userAuth } = require("../middleware/Auth");
const { connectionRequestModel } = require("../models/connectionRequest");

const reqRouter = express.Router();

reqRouter.post(
  "/request/send/:status/:toUserID",
  userAuth,
  async (req, res, next) => {
    try {
      const fromUserID = req.user._id;
      const toUserID = req.params?.toUserID;
      const status = req.params?.status;

      // But in out request schema, in status there are many things, from those we only need to filter out either interested/ignored
      const filteredList = ["interested", "ignored"];
      if (!filteredList.includes(status)) {
        res.status(400).json({ message: `Invalid status type!` });
      }

      // If there are existing same connection request, Then;
      // find wheather there is already user req exists or not, if yes then throw error !
      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserID: fromUserID, toUserID: toUserID },
          { fromUserID: toUserID, toUserID: fromUserID },
        ],
      });
      // It means check connection request from A->B OR B->A, if exists or not!

      if (existingConnectionRequest) {
        res.status(400).json({ message: `Request already has been sent!` });
      }

      const connectionRequest = new connectionRequestModel({
        fromUserID: fromUserID,
        toUserID: toUserID,
        status: status,
      });

      const connectionData = await connectionRequest.save();

      res.json({
        message: `Connecion request sent sucessfully!`,
        data: connectionData,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = reqRouter;
