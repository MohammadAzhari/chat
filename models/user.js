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
});

module.exports = mongoose.model("User", User);
