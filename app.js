var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var indexRouter = require("./routes/index");
var signRouter = require("./routes/sign");
var apiRouter = require("./routes/api");
var flash = require("connect-flash");

require("dotenv").config();

const mongoose = require("mongoose");

var app = express();

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("mongo is connected");
  })
  .catch((err) => {
    console.log(err);
  });

//session :
app.use(
  session({
    secret: "thisismysecretinsession",
    saveUninitialized: false,
    resave: true,
  })
);
app.use(flash());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", signRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
