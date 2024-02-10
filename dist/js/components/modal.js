window.addEventListener("DOMContentLoaded", () => {
  const modals = Array.from(document.getElementsByClassName("modal"));
  const modalBackground = document.createElement("div");
  modalBackground.classList.add("modal__background");

  modalBackground.addEventListener("click", () => {  
    modals.forEach( modal => {
      modal.style.display = "none";
    })
  });

  document.querySelector("main").prepend(modalBackground);
})