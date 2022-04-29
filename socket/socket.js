const Chat = require("../models/chat");
const User = require("../models/user");
const Group = require("../models/groups");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("online", async (userId) => {
      console.log(`${userId} is online`);
      await User.findByIdAndUpdate(userId, { isOnline: true });
      socket.on("disconnect", async () => {
        await User.findByIdAndUpdate(userId, { isOnline: false });
        console.log(`${userId} is offline!`);
      });
    });
    socket.on("joinChat", (id) => {
      socket.join(id);
    });
    socket.on("sendMsg", (data) => {
      console.log(data);
      const { id, message, userId } = data;
      Chat.findByIdAndUpdate(id, {
        $push: {
          messages: {
            content: message,
            sender: userId,
            time: new Date(),
          },
        },
        lastMsg: {
          content: message,
          sender: userId,
          time: new Date(),
        },
      })
        .then(async (r) => {
          let user = await User.findById(userId);
          io.to(id).emit("newMsg", {
            message,
            idOfSender: userId,
            picOfSender: user.pic,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
    socket.on("groupMsg", (data) => {
      console.log(data);
      const { id, message, userId } = data;
      Group.findByIdAndUpdate(id, {
        $push: {
          messages: {
            content: message,
            sender: userId,
            time: new Date(),
          },
        },
        lastMsg: {
          content: message,
          sender: userId,
          time: new Date(),
        },
      })
        .then(async (r) => {
          let user = await User.findById(userId);
          io.to(id).emit("newMsg", {
            message,
            idOfSender: userId,
            picOfSender: user.pic,
            nameOfSender: user.userName,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
    socket.on("typing", (id, pic) => {
      socket.broadcast.to(id).emit("typing", pic);
    });
    socket.on("stopTyping", (id) => {
      socket.broadcast.to(id).emit("stopTyping");
    });
  });
};
