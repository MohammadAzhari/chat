const express = require("express");
const router = express.Router();
const { isAuth } = require("../middle/authcheck");
const multer = require("../middle/multer");
const groupKey = require("../middle/privategroup");
const norender = require("../controllers/norender");

// api route means no rendering pages

// URL /api/chat/id => create chat
router.get("/chat/:id", isAuth, norender.createChat);

// URL POST /api/group => create group
router.post("/group", isAuth, norender.createGroup);

// URL POST /api/settings => changing profile photo
router.post("/settings", multer, norender.uploadPhoto);

// URL POST /api/joingroup/id => join to the group
router.post("/joingroup", isAuth, groupKey, norender.joinGroup);

// URL POST /api/deleteadmin
router.post("/deleteadmin", isAuth, norender.deleteAdmin);

// URL POST /api/makeadminid
router.post("/makeadmin", isAuth, norender.makeAdmin);

// URL POST /api/remove
router.post("/remove", isAuth, norender.remove);

// URL POST /api/private => to make group private
router.post("/private", isAuth, norender.privateP);

// URL GET /api/private/id => to make group puplic
router.get("/private/:id", isAuth, norender.privateG);

// URL POST /api/groupphoto => to change group's photo
router.post("/groupphoto", isAuth, multer, norender.groupPhoto);

// URL GET /api/logout => logout
router.get("/logout", isAuth, (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
