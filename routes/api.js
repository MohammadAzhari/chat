var express = require("express");
var router = express.Router();
const User = require("../models/user");
const Chat = require("../models/chat");
const { isAuth, isNotAuth } = require("../middle/authcheck");
const multer = require("multer");

// create a single chat
router.get("/chat/:id", isAuth, async (req, res, next) => {
  try {
    let chats = await Chat.find({
      $and: [
        { users: { $elemMatch: { $eq: req.session.user._id } } },
        { users: { $elemMatch: { $eq: req.params.id } } },
      ],
    });
    if (chats.length > 0) {
      res.redirect(`/room/${chats[0]._id}`);
    } else {
      await Chat.create({
        users: [req.session.user._id, req.params.id],
      });
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

// sending message :
//  {{{ this route switch to socket.IO }}}

// router.post("/send", isAuth, (req, res, next) => {
//   const { id, msg } = req.body;
//   Chat.findByIdAndUpdate(id, {
//     $push: {
//       messages: {
//         content: msg,
//         sender: req.session.user._id,
//       },
//     },
//     lastMsg: {
//       content: msg,
//       sender: req.session.user._id,
//     },
//   })
//     .then((r) => {
//       console.log(r);
//       res.redirect(`/room/${id}`);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

// changing profile photo :
router.post(
  "/settings",
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "public/images/");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
      },
    }),
  }).single("image"),
  async (req, res, next) => {
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
  }
);

//create a new group :
router.post("/creategroup", isAuth, async (req, res, next) => {
  try {
    const { groupName } = req.body;
    let chat = {
      group: {
        is: true,
        groupName,
      },
      users: [req.session.user._id],
    };
    await Chat.create(chat);
    console.log(chat);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

// serach for group chat :
router.get("/searchgroup", isAuth, async (req, res, next) => {
  try {
    let groups = await Chat.find({
      "group.is": true,
    }).find({
      "group.groupName": { $regex: req.query.groupName, $options: "i" },
    });
    console.log(groups);
    res.render("groups", { groups });
  } catch (error) {
    console.log(error);
  }
});

// join to the group :
router.get("/joingroup/:id", isAuth, async (req, res, next) => {
  try {
    await Chat.findOneAndUpdate(
      {
        $and: [
          { _id: req.params.id },
          { users: { $ne: req.session.user._id } },
        ],
      },
      {
        $push: { users: req.session.user._id },
      }
    );
    res.redirect("/room/" + req.params.id);
  } catch (error) {
    console.log(error);
  }
});

//log out
router.get("/logout", isAuth, (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
