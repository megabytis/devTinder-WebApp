const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "rejected", "interested", "ignored"],
        message: `{VALUE} is of incorrect status type!`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserID: 1, toUserID: 1 });

connectionRequestSchema.pre("save", function (next) {
  // If the user is sending connection request to him/herself 😅
  const connectionRequest = this;
  if (connectionRequest.fromUserID.equals(connectionRequest.toUserID)) {
    throw new Error("Can't send request to self!");
  }
  next();
});

const connectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = {
  connectionRequestModel,
};
