var express = require("express");
var router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { isAuth, isNotAuth } = require("../middle/authcheck");

// sign page :
router.get("/sign", isNotAuth, (req, res, next) => {
  res.render("sign", { msg: req.flash("signErr") });
});

// post signup :
router.post("/signup", async (req, res, next) => {
  try {
    const { user, password, confirm } = req.body;
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
    res.status(404);
    console.log(error);
  }
});

// post login :
router.post("/login", async (req, res, next) => {
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
    res.status(404);
    console.log(error);
  }
});

module.exports = router;
