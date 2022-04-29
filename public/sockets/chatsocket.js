let cog = document.getElementById("cog").value;
let msg = document.getElementById("message");
let id = document.getElementById("chatId").value;
let btn = document.getElementById("btn");
let pic = document.getElementById("pic").value;
let userName = document.getElementById("userName").value;
let container = document.getElementById("container");
let typing = document.getElementById("typing");
window.scrollTo(0, document.body.scrollHeight);

socket.emit("joinChat", id);

btn.onclick = () => {
  let message = msg.value;
  if (cog == "chat" && msg.value != "")
    socket.emit("sendMsg", { id, message, userId });
  else if (cog == "group" && msg.value != "")
    socket.emit("groupMsg", { id, message, userId });
  msg.value = "";
};

socket.on("newMsg", (data) => {
  typing.innerHTML = "";
  const { message, idOfSender, picOfSender } = data;
  let time = new Date();
  const formatedTime = time.toString().slice(16, 24);
  if (idOfSender == userId) {
    container.innerHTML += `
               <div class="d-flex flex-row justify-content-start">
            <img
              src="/images/${picOfSender}"
              alt="avatar 1"
              style="width: 45px; height: 100%;"
            />
            <div>
              <p
                class="small p-2 ms-3 mb-1 rounded-3"
                style="background-color: #f5f6f7;"
              >${message}</p>
              <p class="small ms-3 mb-3 rounded-3 text-muted float-end">${formatedTime}</p>
            </div>
          </div>
    `;
  } else {
    container.innerHTML += `
                  <div class="d-flex flex-row justify-content-end">
            <div>
              <p
                class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary"
              >${message}</p>
              <p class="small me-3 mb-3 rounded-3 text-muted">${formatedTime}</p>
            </div>
            <img
              src="/images/${picOfSender}"
              alt="avatar 1"
              style="width: 45px; height: 100%;"
            />
          </div>
    `;
  }
  window.scrollTo(0, document.body.scrollHeight);
});

msg.addEventListener("keyup", () => {
  socket.emit("typing", id, pic);
  setTimeout(() => {
    socket.emit("stopTyping", id);
  }, 3000);
});

socket.on("typing", (pic) => {
  typing.innerHTML = `
          <div class="d-flex flex-row justify-content-start">
            <img
              src="/images/${pic}"
              alt="avatar 1"
              style="width: 45px; height: 100%;"
            />
            <div>
              <p
                class="small p-2 ms-3 mb-1 rounded-3"
                style="background-color: #f5f6f7;"
              > is typing .... <i class="fa-solid fa-keyboard"></i> </p>
            </div>
          </div>
  `;
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("stopTyping", () => {
  typing.innerHTML = "";
});
