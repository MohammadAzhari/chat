const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const Group = require("../models/groups");
const User = require("../models/user");
const { isAuth } = require("../middle/authcheck");
const { chickChat, chickGroup } = require("../middle/chickchat");
const homePage = require("../controllers/homepage");
const chatPage = require("../controllers/chatpage");
const groupPage = require("../controllers/grouppage");
const nav = require("../controllers/nav");

// ------------------------------------------------------------------------------
// index route means there is render function
// ------------------------------------------------------------------------------

// URL GET / => homepage
router.get("/", isAuth, homePage);

// URL GET /chat/id => chatpage
router.get("/chat/:id", isAuth, chickChat, chatPage);

// URL GET /group/id => grouppage
router.get("/group/:id", isAuth, chickGroup, groupPage);

// URL GET /search => search
router.get("/search", isAuth, nav.search);

// URL GET /groupsettings/id :
router.get("/groupsettings/:id", isAuth, nav.groupSettings);

// change profile photo :
router.get("/settings", isAuth, (req, res, next) => {
  res.render("settings", {
    nav: true,
    userId: req.session.user._id,
    userName: req.session.user.userName,
    userPic: req.session.user.pic,
  });
});

router.get("/dbusers", async (req, res) => {
  let users = await User.find();
  console.log(users);
});

// see db :
router.get("/dbchats", async (req, res, next) => {
  let chats = await Chat.find().populate("users");
  console.log(chats);
  console.log(chats.users);
  //   console.log(chats.users[1]);
});

//clear.all messages :
router.get("/clear", async (req, res, next) => {
  await Chat.deleteMany();
  await Group.deleteMany();
});

module.exports = router;
