const DOM_FORM = document.getElementById("form");
const DOM_NAME = document.getElementById("form--name");
const DOM_EMAIL = document.getElementById("form--email");
const DOM_NUMBER = document.getElementById("form--tel");
const DOM_CATEGORY = document.getElementById("form--category");
const DOM_SERVICE = document.getElementById("form--service");
const DOM_MESSAGE = document.getElementById("form--message");
const DOM_BUTTON = document.getElementById("form--submit");

const DOM_MODAL_NAME = document.getElementById("form-modal--name");
const DOM_MODAL_EMAIL = document.getElementById("form-modal--email");
const DOM_MODAL_NUMBER = document.getElementById("form-modal--phone");
const DOM_MODAL_CATEGORY = document.getElementById("form-modal--category");
const DOM_MODAL_SERVICE = document.getElementById("form-modal--service");
const DOM_MODAL_MESSAGE = document.getElementById("form-modal--message");
const DOM_MODAL_SUBMIT = document.getElementById("form-modal--submit")

const data = {
  name: '',
  email: '',
  number: '',
  category: '',
  service: '',
  message: '',
  getData: function(){
    this.name = DOM_NAME.value;
    this.email = DOM_EMAIL.value;
    this.number = DOM_NUMBER.value;
    this.category = DOM_CATEGORY.value;
    this.service = DOM_SERVICE.value;
    this.message = DOM_MESSAGE.value;
  }
};

DOM_CATEGORY.addEventListener("change", (e) => {
  if(DOM_CATEGORY.value === "service"){
    DOM_SERVICE.parentElement.style.display = "block";
  }
  else{
    DOM_SERVICE.parentElement.style.display = "none";
  }
});

const getProcessedData = () => {
  data.getData();
  let parseData;
  if(data.category !== "service"){
    parseData = {
      name: data.name,
      email: data.email,
      number: data.number,
      category: data.category,
      message: data.message
    }
  }
  else{
    parseData = {
      name: data.name,
      email: data.email,
      number: data.number,
      service: data.service,
      message: data.message
    }
  }
  return parseData;
}
const writeModalForm = () => {
  DOM_MODAL_NAME.value = data.name;
  DOM_MODAL_EMAIL.value = data.email;
  DOM_MODAL_NUMBER.value = data.number;
  DOM_MODAL_MESSAGE.value = data.message;

  let categoryValue;
  let serviceValue;

  for(const option of DOM_CATEGORY.options){
    if(option.value === data.category) categoryValue = option.textContent.trim();
  }
  for(const option of DOM_SERVICE.options){
    if(option.value === data.service) serviceValue = option.textContent.trim();
  }


  DOM_MODAL_CATEGORY.value = categoryValue;
  DOM_MODAL_SERVICE.value = serviceValue;

  if(data.category === "service"){
    DOM_MODAL_CATEGORY.parentElement.style.display = "none";
    DOM_MODAL_SERVICE.parentElement.style.display = "block";
  }
  else{
    DOM_MODAL_SERVICE.parentElement.style.display = "none"
    DOM_MODAL_CATEGORY.parentElement.style.display = "block";
  }
}

DOM_FORM.addEventListener("submit", (e) => {
  e.preventDefault();

  data.getData();
  for(const key in data){
    if(typeof(data[key]) !== "string") continue;
    if(data[key].trim() === ""){
      alert("Vă rugăm să umpleți toate rândurile" + key);
      return;
    };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(data.email)){
    alert("Vă rugăm să introduceți o adresă validă");
    return;
  }
  writeModalForm();
  openModal("modal--submit");
});
DOM_MODAL_SUBMIT.addEventListener("click", () => {
  const data = getProcessedData();
  const url = '/server';
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    DOM_FORM.reset();
    DOM_MODAL_SUBMIT.removeAttribute("disabled");
    DOM_MODAL_SUBMIT.style.cursor = "pointer";
    closeModal();
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
  
  DOM_MODAL_SUBMIT.setAttribute("disabled", true);
  DOM_MODAL_SUBMIT.style.cursor = "not-allowed";

  localStorage.setItem("BBA_form-data", null);
})

const updateData = () => {
  const processedData = getProcessedData();
  const stringifiedData = JSON.stringify(processedData);
  localStorage.setItem("BBA_form-data", stringifiedData);
} 
DOM_NAME.addEventListener("change", updateData);
DOM_EMAIL.addEventListener("change", updateData);
DOM_NUMBER.addEventListener("change", updateData);
DOM_CATEGORY.addEventListener("change", updateData);
DOM_SERVICE.addEventListener("change", updateData);
DOM_MESSAGE.addEventListener("change", updateData);

window.addEventListener("DOMContentLoaded", () => {
  const stringifiedData = localStorage.getItem("BBA_form-data");
  const data = JSON.parse(stringifiedData);
  
  if(!data) return;

  DOM_NAME.value = data.name;
  DOM_EMAIL.value = data.email;
  DOM_NUMBER.value = data.number;
  DOM_MESSAGE.value = data.message;
  if(data.category){
    DOM_CATEGORY.value = data.category;
  }
  else{
    DOM_CATEGORY.value = "service";
    DOM_SERVICE.value = data.service;
    DOM_SERVICE.parentElement.style.display = "block";
  }
});