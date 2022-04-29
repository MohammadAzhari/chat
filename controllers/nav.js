const User = require("../models/user");
const Chat = require("../models/chat");
const Group = require("../models/groups");

// search for users or groups :
exports.search = async (req, res, next) => {
  try {
    let users = req.query.search
      ? await User.find({
          userName: { $regex: req.query.search, $options: "i" },
        }).find({ _id: { $ne: req.session.user._id } })
      : await User.find({ _id: { $ne: req.session.user._id } });

    let groups = req.query.search
      ? await Group.find({
          groupName: { $regex: req.query.search, $options: "i" },
        })
      : await Group.find();
    res.render("search", {
      nav: true,
      users,
      groups,
      userId: req.session.user._id,
      err: req.flash("groupKeyErr"),
    });
  } catch (error) {
    console.log(error);
  }
};

exports.groupSettings = async (req, res, next) => {
  try {
    // get group
    // get all its users
    // if admin or not
    let group = await Group.findById(req.params.id);
    group = await User.populate(group, {
      path: "users.user",
      select: "_id userName pic isOnline",
    });
    let admin = false;
    let users = [];
    group.users.forEach((r) => {
      if (r.user._id == req.session.user._id) {
        if (r.isAdmin) admin = true;
      } else users.push(r);
    });
    res.render("groupsettings", {
      nav: true,
      admin,
      users,
      groupId: req.params.id,
      groupName: group.groupName,
      groupImg: group.groupImg,
      userId: req.session.user._id,
      group: [group],
    });
  } catch (error) {
    console.log(error);
  }
};
