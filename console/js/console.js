const servicesDOM = document.getElementById("services");
const messagesDOM = document.getElementById("messages");
const servicesButtonDOM = document.getElementById("sidebar--services");
const messagesButtonDOM = document.getElementById("sidebar--messages");
function changeTo(setting){
  if(setting === "services"){
    servicesDOM.style.display = "block";
    messagesDOM.style.display = "none";
    servicesButtonDOM.classList.add("sidebar__item--selected");
    messagesButtonDOM.classList.remove("sidebar__item--selected");
  }
  else{
    messagesDOM.style.display = "block";
    servicesDOM.style.display = "none";
    messagesButtonDOM.classList.add("sidebar__item--selected");
    servicesButtonDOM.classList.remove("sidebar__item--selected");
  }

}