const User = require("../models/user");
const Group = require("../models/groups");

module.exports = async (req, res, next) => {
  let group = await Group.findById(req.params.id);
  console.log(group);
  group = await User.populate(group, {
    path: "messages.sender",
    select: "userName pic",
  });

  let messages =
    group.messages.length > 0
      ? group.messages.map((msg) => {
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
    group: true,
    nav: true,
    name: group.groupName,
    pic: group.groupImg,
    messages,
    myPic: req.session.user.pic,
    chatId: req.params.id,
    userId: req.session.user._id,
    userName: req.session.user.userName,
  });
};
