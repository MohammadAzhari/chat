const User = require("../models/user");
const Chat = require("../models/chat");
const Group = require("../models/groups");

module.exports = async (req, res, next) => {
  // we need to see all chat belong to this user as {other user : Name , Img , lastMessage }
  // we need to see all groups belong to this user as {group : name , img , lastMessage }
  let chats = await Chat.find({
    users: { $elemMatch: { $eq: req.session.user._id } },
  });
  chats = await User.populate(chats, {
    path: "lastMsg.sender",
    select: "userName pic",
    path: "users",
    select: "userName pic isOnline",
  });
  let groups = await Group.find({
    users: { $elemMatch: { user: req.session.user._id } },
  });
  groups = await User.populate(groups, {
    path: "lastMsg.sender",
    select: "userName pic",
  });
  let arrOfChats = [];
  let arrOfGroups = [];
  await chats.forEach((chat) => {
    let user;
    for (let i = 0; i < 2; i++) {
      if (chat.users[i]._id != req.session.user._id) {
        user = chat.users[i];
      }
    }
    let Obj = {
      _id: chat._id,
      name: user.userName,
      pic: user.pic,
      lastMsg: chat.lastMsg.content ? chat.lastMsg.content : "",
      time: chat.lastMsg.time ? chat.lastMsg.time.toString().slice(16, 24) : "",
      sender: chat.lastMsg.sender ? chat.lastMsg.sender.userName : "",
      online: user.isOnline,
    };
    arrOfChats.push(Obj);
  });
  await groups.forEach((group) => {
    let Obj = {
      _id: group._id,
      name: group.groupName,
      pic: group.groupImg,
      lastMsg: group.lastMsg.content ? group.lastMsg.content : "",
      time: group.lastMsg.time
        ? group.lastMsg.time.toString().slice(16, 24)
        : "",
      sender: group.lastMsg.sender ? group.lastMsg.sender.userName : "",
    };
    arrOfGroups.push(Obj);
  });
  let newUser = arrOfChats.length == 0 ? true : false;
  res.render("home", {
    userId: req.session.user._id,
    nav: true,
    arrOfChats,
    arrOfGroups,
    home: true,
    newUser,
  });
};
