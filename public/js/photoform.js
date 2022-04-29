var changePhoto = document.getElementById("changePhoto");
var formPhoto = document.getElementById("formPhoto");

changePhoto.onclick = () => {
  if (changePhoto.textContent == "cancle") {
    formPhoto.classList.add("d-none");
    changePhoto.textContent = "change profile photo";
    changePhoto.classList.replace("btn-danger", "btn-warning");
  } else {
    formPhoto.classList.remove("d-none");
    changePhoto.textContent = "cancle";
    changePhoto.classList.replace("btn-warning", "btn-danger");
  }
};
