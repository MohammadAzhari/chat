const mongoose = require("mongoose");

const User = mongoose.Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  pic: {
    type: String,
    default: "default.png",
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", User);
