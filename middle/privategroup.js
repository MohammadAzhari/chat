const Group = require("../models/groups");

module.exports = async (req, res, next) => {
  const { id, key } = req.body;
  let group = await Group.findById(id);
  if (group.private.is && group.private.key != key) {
    req.flash("groupKeyErr", "wrong group password");
    res.redirect("/search");
    return;
  } else next();
};
