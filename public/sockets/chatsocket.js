let socket = io();

let msg = document.getElementById("message");
let id = document.getElementById("chatId").value;
let btn = document.getElementById("submit");
let userId = document.getElementById("userId").value;
let userName = document.getElementById("userName").value;
let ul = document.getElementById("ul");
let typing = document.getElementById("typing");
window.scrollTo(0, document.body.scrollHeight);

socket.emit("joinChat", id);

btn.onclick = () => {
  let message = msg.value;
  console.log("msg = " + message);
  socket.emit("sendMsg", { id, message, userId });
  msg.value = "";
  window.scrollTo(0, document.body.scrollHeight);
};

socket.on("newMsg", (data) => {
  typing.innerHTML = "";
  const { message, idOfSender, picOfSender, nameOfSender } = data;
  if (idOfSender == userId) {
    ul.innerHTML += `
                <li class="d-flex justify-content-between mb-4">
                  <div class="card w-100">
                    <div class="card-header d-flex justify-content-between p-3"
                      style="background-color: rgb(185, 245, 245);">
                      <p class="fw-bold mb-0">${nameOfSender}</p>
                    </div>
                    <div class="card-body">
                      <p class="mb-0">
                        ${message}
                      </p>
                    </div>
                  </div>
                  <img
                    src="/images/${picOfSender}"
                    alt="avatar"
                    class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                    width="60"
                  />
                </li>
    `;
  } else {
    ul.innerHTML += `
                  <li class="d-flex justify-content-between mb-4">
                    <img
                      src="/images/${picOfSender}"
                      alt="avatar"
                      class="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                      width="60"
                    />
                    <div class="card w-100">
                      <div class="card-header d-flex justify-content-between p-3">
                        <p class="fw-bold mb-0">${nameOfSender}</p>
                      </div>
                      <div class="card-body">
                        <p class="mb-0">
                          ${message}
                        </p>
                      </div>
                    </div>
                  </li>
    `;
  }
});

msg.addEventListener("keyup", () => {
  socket.emit("typing", id, userName);
});

socket.on("typing", (name) => {
  // if (msg.value != "")
  typing.innerHTML = `<b>${name}</b> is typing`;
  // else typing.innerHTML = "";
});
