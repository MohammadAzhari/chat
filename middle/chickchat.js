const Chat = require("../models/chat");
const Group = require("../models/groups");

const chickChat = async (req, res, next) => {
  let chicker = false;
  let chat = await Chat.findById(req.params.id);
  await chat.users.forEach((user) => {
    if (user == req.session.user._id) chicker = true;
  });
  if (!chicker) {
    res.redirect("/");
    return;
  } else next();
};

const chickGroup = async (req, res, next) => {
  let chicker = false;
  let group = await Group.findById(req.params.id);
  await group.users.forEach((user) => {
    if (user.user == req.session.user._id) chicker = true;
  });
  if (!chicker) {
    res.redirect("/");
    return;
  } else next();
};

module.exports = { chickChat, chickGroup };
