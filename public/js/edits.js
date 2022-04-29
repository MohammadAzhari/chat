var private = document.getElementById("private");
var hider = document.getElementById("hider");

private.onclick = () => {
  if (private.textContent == "cancle") {
    hider.classList.add("d-none");
    private.textContent = "enter group key";
    private.classList.replace("btn-danger", "btn-warning");
  } else {
    hider.classList.remove("d-none");
    private.textContent = "cancle";
    private.classList.replace("btn-warning", "btn-danger");
  }
};
