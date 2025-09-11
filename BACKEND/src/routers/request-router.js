const express = require("express");
const { userAuth } = require("../middleware/Auth");
const { connectionRequestModel } = require("../models/connectionRequest");
const { UserModel } = require("../models/user");

const reqRouter = express.Router();

reqRouter.post(
  "/request/send/:status/:toUserID",
  userAuth,
  async (req, res, next) => {
    try {
      const fromUserID = req.user._id;
      const fromUser = req.user;
      const toUserID = req.params?.toUserID;
      const toUser = await UserModel.findById(toUserID);
      const status = req.params?.status;

      // checking wheather toUserID even exists or not in our DB
      // or to handle if attacker tries to input a random toUserID
      const doesToUserIDExist = toUser;
      if (!doesToUserIDExist) {
        throw new Error("Bad user request!");
      }

      // But in our request schema, in status there are many things, from those we only need to filter out either interested/ignored
      const filteredStatusList = ["interested", "ignored"];
      if (!filteredStatusList.includes(status)) {
        throw new Error(`Invalid status type!`);
      }

      // If there are existing same connection request, Then;
      // find wheather there is already user req exists or not, if yes then throw error !
      const isItAnExistingConnectionRequest =
        await connectionRequestModel.findOne({
          $or: [
            { fromUserID: fromUserID, toUserID: toUserID },
            { fromUserID: toUserID, toUserID: fromUserID },
          ],
        });
      // It means check connection request from A->B OR B->A, if exists or not!
      if (isItAnExistingConnectionRequest) {
        throw new Error(`Request already has been sent!`);
      }

      const connectionRequest = new connectionRequestModel({
        fromUserID: fromUserID,
        toUserID: toUserID,
        status: status,
      });

      const connectionData = await connectionRequest.save();

      status === "interested"
        ? res.json({
            message: `${fromUser.firstName} is ${status} in ${toUser.firstName} 💐`,
            data: connectionData,
          })
        : res.json({
            message: `${fromUser.firstName}, ${status} ${toUser.firstName} 😔`,
            data: connectionData,
          });
    } catch (err) {
      next(err);
    }
  }
);

reqRouter.post(
  "/request/review/:status/:requestID",
  userAuth,
  async (req, res, next) => {
    try {
      const status = req.params?.status;
      const fromUserID = req.user._id;
      const toUserID = req.params?.requestID;
      const toUser = await UserModel.findById(toUserID);

      const anyExistingRequest = await connectionRequestModel.findOne({
        fromUserID: toUserID,
        toUserID: fromUserID,
        status: "interested",
      });
      if (!anyExistingRequest) {
        throw new Error("No request found!");
      }

      // filtering status only to accepted & rejected
      const filteredStatusList = ["accepted", "rejected"];
      if (!filteredStatusList.includes(status)) {
        throw new Error(`Invalid status type!`);
      }

      anyExistingRequest.status = status;
      const updatedRequest = await anyExistingRequest.save();

      res.json({
        message: `${req.user.firstName}, ${status} ${toUser.firstName}`,
        data: updatedRequest,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = reqRouter;
