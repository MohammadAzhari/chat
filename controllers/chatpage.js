const User = require("../models/user");
const Chat = require("../models/chat");

module.exports = async (req, res, next) => {
  // we know chat by its params
  // we need to show chat : {name , img}
  // we need to sort all messages and know if it mine or not
  let chat = await Chat.findById(req.params.id).populate("users");
  chat = await User.populate(chat, {
    path: "messages.sender",
    select: "userName pic",
  });
  let user;
  for (let i = 0; i < 2; i++) {
    if (chat.users[i]._id != req.session.user._id) {
      user = chat.users[i];
    }
  }
  let messages =
    chat.messages.length > 0
      ? chat.messages.map((msg) => {
          return {
            content: msg.content,
            my: msg.sender._id == req.session.user._id ? true : false,
            pic: msg.sender.pic,
            sender: msg.sender.userName,
            time: msg.time ? msg.time.toString().slice(16, 24) : "",
          };
        })
      : [];
  res.render("chat", {
    nav: true,
    name: user.userName,
    pic: user.pic,
    online: user.isOnline,
    messages,
    myPic: req.session.user.pic,
    chatId: req.params.id,
    userId: req.session.user._id,
    userName: req.session.user.userName,
  });
};
