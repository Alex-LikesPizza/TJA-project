const modals = Array.from(document.getElementsByClassName("modal"));

const modalBackground = document.createElement("div");
modalBackground.classList.add("modal__background");

function openModal(modalId){
  const modal = document.getElementById(modalId);

  modal.style.display = "block";
  modalBackground.style.display = "block";
  document.body.style.overflowY = 'hidden';
}
function closeModal(){
  modalBackground.style.display = "none";
  
  modals.forEach( modal => {
    modal.style.display = "none";
  });
  document.body.style.overflowY = 'scroll';
}

modalBackground.addEventListener("click", closeModal);

document.querySelector("body").appendChild(modalBackground);