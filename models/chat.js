const mongoose = require("mongoose");

const Chat = mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        content: { type: String },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        time: { type: Date },
      },
    ],
    lastMsg: {
      content: { type: String },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      time: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", Chat);
