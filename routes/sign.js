var express = require("express");
var router = express.Router();
const { isNotAuth, isAuth } = require("../middle/authcheck");
const sign = require("../controllers/signpage");

router.get("/sign", isNotAuth, (req, res, next) => {
  res.render("sign", { msg: req.flash("signErr") });
});

router.post("/signup", isNotAuth, sign.signUP);
router.post("/login", isNotAuth, sign.logIn);

router.get("/logout", isAuth, (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
