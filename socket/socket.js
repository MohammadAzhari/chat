const Chat = require("../models/chat");
const User = require("../models/user");

module.exports = (io) => {
  io.on("connection", (socket) => {
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
          },
        },
        lastMsg: {
          content: message,
          sender: userId,
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
    socket.on("typing", (id, userName) => {
      socket.broadcast.to(id).emit("typing", userName);
    });
  });
};
