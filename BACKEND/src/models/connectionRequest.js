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

connectionRequestSchema.pre("save", function (next) {
  // If the user is sending connection request to him/herself 😅
  if (this.fromUserID.equals(this.toUserID)) {
    throw new Error("Can't send request to self!");
  }
});

const connectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = {
  connectionRequestModel,
};
