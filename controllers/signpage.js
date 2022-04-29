const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.signUP = async (req, res, next) => {
  try {
    const { user, password, confirm } = req.body;
    if (user.length < 4 || password.length < 4) {
      req.flash("signErr", "it must be more than 3 chars");
      res.redirect("/");
    }
    const isExist = await User.findOne({ userName: user });
    if (isExist) {
      req.flash("signErr", "User is already exist");
      res.redirect("/");
    } else if (password != confirm) {
      req.flash("signErr", "password and confirm doesnt match");
      res.redirect("/");
    } else {
      const hashed = await bcrypt.hash(password, 10);
      const he = await User.create({
        userName: user,
        password: hashed,
      });
      req.session.user = he;
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { user, password } = req.body;
    const isExist = await User.findOne({ userName: user });
    if (!isExist) {
      req.flash("signErr", "this user doesnt exist");
    } else {
      const match = await bcrypt.compare(password, isExist.password);
      if (!match) {
        req.flash("signErr", "wrong password");
      } else {
        req.session.user = isExist;
      }
    }
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
