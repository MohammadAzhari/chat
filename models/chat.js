const mongoose = require("mongoose");

const Chat = mongoose.Schema({
  group: {
    is: { type: Boolean, default: false },
    groupName: { type: String, unique: true },
    founder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
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
    },
  ],
  lastMsg: {
    content: { type: String, default: "" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
});

module.exports = mongoose.model("Chat", Chat);
