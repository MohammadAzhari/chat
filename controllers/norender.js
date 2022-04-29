const User = require("../models/user");
const Chat = require("../models/chat");
const Group = require("../models/groups");

exports.createChat = async (req, res, next) => {
  try {
    let chats = await Chat.find({
      $and: [
        { users: { $elemMatch: { $eq: req.session.user._id } } },
        { users: { $elemMatch: { $eq: req.params.id } } },
      ],
    });
    if (chats.length > 0) {
      res.redirect(`/chat/${chats[0]._id}`);
    } else {
      Chat.create({
        users: [req.session.user._id, req.params.id],
      }).then((r) => {
        res.redirect(`/chat/${r._id}`);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.createGroup = (req, res, next) => {
  let group = {
    groupName: req.body.groupName,
    users: [{ user: req.session.user._id, isAdmin: true }],
  };
  Group.create(group)
    .then((result) => {
      console.log(result);
      res.redirect(`/groupsettings/${result._id}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.joinGroup = async (req, res, next) => {
  try {
    let isAlready = await Group.findOne({
      $and: [
        { _id: req.body.id },
        { users: { $elemMatch: { user: req.session.user._id } } },
      ],
    });
    if (!isAlready) {
      await Group.findByIdAndUpdate(req.body.id, {
        $push: { users: { user: req.session.user._id, isAdmin: false } },
      });
    }
    res.redirect("/group/" + req.body.id);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteAdmin = async (req, res, next) => {
  try {
    const { userId, groupId } = req.body;
    let group = await Group.findById(groupId);
    await group.users.forEach((r) => {
      if (r.user == userId) r.isAdmin = false;
    });
    await Group.findByIdAndUpdate(groupId, { $set: group });
    res.redirect("/groupsettings/" + groupId);
  } catch (error) {
    console.log(error);
  }
};

exports.makeAdmin = async (req, res, next) => {
  try {
    const { userId, groupId } = req.body;
    let group = await Group.findById(groupId);
    await group.users.forEach((r) => {
      if (r.user == userId) r.isAdmin = true;
    });
    Group.findByIdAndUpdate(groupId, { $set: group }).then((r) => {
      console.log(r);
      res.redirect("/groupsettings/" + groupId);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { userId, groupId } = req.body;
    await Group.findByIdAndUpdate(groupId, {
      $pull: {
        users: { user: userId },
      },
    });
    res.redirect("/groupsettings/" + groupId);
  } catch (error) {
    console.log(error);
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    console.log(req.file);
    if (req.file)
      await User.findByIdAndUpdate(req.session.user._id, {
        pic: req.file.filename,
      });
    req.session.user.pic = req.file.filename;
    res.redirect("/settings");
  } catch (error) {
    console.log(error);
  }
};

exports.groupPhoto = async (req, res, next) => {
  try {
    if (req.file)
      await Group.findByIdAndUpdate(req.body.id, {
        groupImg: req.file.filename,
      });
    res.redirect("/groupsettings/" + req.body.id);
  } catch (error) {
    console.log(error);
  }
};

exports.privateP = async (req, res, next) => {
  try {
    const { id, key } = req.body;
    await Group.findByIdAndUpdate(id, {
      private: {
        is: true,
        key,
      },
    });
    res.redirect("/groupsettings/" + id);
  } catch (error) {
    console.log(error);
  }
};

exports.privateG = async (req, res, next) => {
  try {
    await Group.findByIdAndUpdate(req.params.id, {
      private: {
        is: false,
        key: "",
      },
    });
    res.redirect("/groupsettings/" + req.params.id);
  } catch (error) {
    console.log(error);
  }
};
