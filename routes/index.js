var express = require("express");
var router = express.Router();
const User = require("../models/user");
const Chat = require("../models/chat");
const { isAuth, isNotAuth } = require("../middle/authcheck");
const chat = require("../models/chat");

// home page
router.get("/", isAuth, async (req, res, next) => {
  try {
    let empty = false;
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.session.user._id } },
    });
    if (chats.length == 0) {
      empty = true;
    }
    chats = await User.populate(chats, {
      path: "lastMsg.sender",
      select: "userName pic",
    });
    // i need if !group : userName , pic , lastmsg
    let arrOfObj = [];
    await chats.forEach(async (chat) => {
      if (!chat.group.is) {
        let id;
        for (let i = 0; i < 2; i++) {
          if (chat.users[i] != req.session.user._id) {
            id = chat.users[i];
          }
        }
        let user = await User.findById(id);
        let obj = {
          _id: chat._id,
          userName: user.userName,
          pic: user.pic,
          lastMsg: chat.lastMsg.content,
          sender: chat.lastMsg.sender ? chat.lastMsg.sender.userName : "",
        };
        arrOfObj.push(obj);
      } else {
        let obj = {
          _id: chat._id,
          userName: chat.group.groupName,
          pic: "3.jpg",
          lastMsg: chat.lastMsg.content,
          sender: chat.lastMsg.sender ? chat.lastMsg.sender.userName : "",
        };
        arrOfObj.push(obj);
      }
    });
    let users = await User.find({ _id: { $ne: req.session.user._id } });
    res.render("home", {
      empty,
      users,
      chats: arrOfObj,
      params: false,
    });
  } catch (error) {
    console.log(error);
  }
});

// here user can select a chat :
router.get("/room/:id", isAuth, async (req, res, next) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.session.user._id } },
    });
    if (chats.length == 0) {
      empty = true;
    }
    chats = await User.populate(chats, {
      path: "lastMsg.sender",
      select: "userName pic",
    });
    // i need if !group : userName , pic , lastmsg
    let arrOfObj = [];
    let currentChat = {};
    await chats.forEach(async (chat) => {
      if (!chat.group.is) {
        let id;
        for (let i = 0; i < 2; i++) {
          if (chat.users[i] != req.session.user._id) {
            id = chat.users[i];
          }
        }
        let user = await User.findById(id);
        if (chat._id == req.params.id) {
          currentChat = {
            name: user.userName,
            pic: user.pic,
          };
        }
        let obj = {
          _id: chat._id,
          userName: user.userName,
          pic: user.pic,
          lastMsg: chat.lastMsg.content,
          sender: chat.lastMsg.sender ? chat.lastMsg.sender.userName : "",
        };
        arrOfObj.push(obj);
      } else {
        let obj = {
          _id: chat._id,
          userName: chat.group.groupName,
          pic: "3.jpg",
          lastMsg: chat.lastMsg.content,
          sender: chat.lastMsg.sender ? chat.lastMsg.sender.userName : "",
        };

        arrOfObj.push(obj);
      }
    });
    let chat = await Chat.findById(req.params.id);
    if (chat.group.is) {
      currentChat = {
        name: chat.group.groupName,
        pic: "3.jpg",
      };
    }
    chat = await User.populate(chat, {
      path: "messages.sender",
      select: "userName pic",
    });
    let messages =
      chat.messages.length > 0
        ? chat.messages.map((msg) => {
            let returned = {
              content: msg.content,
              my: msg.sender._id == req.session.user._id ? true : false,
              pic: msg.sender.pic,
              sender: msg.sender.userName,
            };
            return returned;
          })
        : [];
    res.render("home", {
      chats: arrOfObj,
      params: true,
      messages,
      userId: req.session.user._id,
      chatId: req.params.id,
      userName: req.session.user.userName,
      chatName: currentChat.name,
      chatPic: currentChat.pic,
    });
  } catch (error) {
    console.log(error);
  }
});

// search or see users :
router.get("/allusers", isAuth, async (req, res, next) => {
  try {
    let users;
    if (!req.query.user)
      users = await User.find({ _id: { $ne: req.session.user._id } });
    else {
      users = await User.find({
        userName: { $regex: req.query.user, $options: "i" },
      }).find({ _id: { $ne: req.session.user._id } });
    }
    res.render("users", { arr: users });
  } catch (error) {
    console.log(error);
  }
});

// change profile photo :
router.get("/settings", isAuth, (req, res, next) => {
  res.render("settings", {
    userName: req.session.user.userName,
    userPic: req.session.user.pic,
  });
});

// create group chat :
router.get("/group", isAuth, async (req, res, next) => {
  res.render("group", {
    userId: req.session.user._id,
  });
});

// see db :
router.get("/dbchats", async (req, res, next) => {
  let chats = await Chat.find().populate("users");
  console.log(chats);
  console.log(chats.users);
  //   console.log(chats.users[1]);
});

//clear.all messages :
router.get("/clear", (req, res, next) => {
  Chat.deleteMany().then(() => {
    res.redirect("/");
  });
});

router.get("/front", (req, res, next) => {
  res.render("copy");
});

module.exports = router;
