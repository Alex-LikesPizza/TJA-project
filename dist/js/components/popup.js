function showPopup(message, isSuccess, time = 3000) {
  var popup = document.getElementById("popup");
  popup.innerText = message;
  popup.classList.remove("success");
  popup.classList.remove("fail");
  if(isSuccess === true) popup.classList.add("success");
  else if(isSuccess === false) popup.classList.add("fail");
  popup.style.display = "block";
  popup.style.animation = "float-right 0.3s ease-out backwards";
  setTimeout(function() {
    popup.style.animation = "float-out-left 0.3s ease-in";
  }, time - 300);
  setTimeout(function() {
    popup.style.display = "none";
  }, time);
}

window.addEventListener("DOMContentLoaded", () => {
  const popup = document.createElement("div");
  popup.id = "popup";
  document.body.append(popup);
});
