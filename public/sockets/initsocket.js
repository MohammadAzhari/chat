let socket = io();
let userId = document.getElementById("userId").value;

socket.on("connect", () => {
  socket.emit("online", userId);
});
