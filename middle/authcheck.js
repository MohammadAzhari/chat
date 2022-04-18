const isAuth = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/sign");
    return;
  } else {
    next();
  }
};

const isNotAuth = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  } else {
    next();
  }
};

module.exports = { isAuth, isNotAuth };
