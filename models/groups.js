const mongoose = require("mongoose");

const Group = mongoose.Schema(
  {
    groupName: {
      type: String,
    },
    groupImg: {
      type: String,
      default: "3.jpg",
    },
    users: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isAdmin: { type: Boolean, default: false },
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
      content: { type: String, default: "" },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      time: { type: Date },
    },
    private: {
      is: { type: Boolean, default: false },
      key: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", Group);
