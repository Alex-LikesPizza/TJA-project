const DOM_FORM = document.getElementById("form");
const DOM_NAME = document.getElementById("form--name");
const DOM_EMAIL = document.getElementById("form--email");
const DOM_NUMBER = document.getElementById("form--tel");
const DOM_CATEGORY = document.getElementById("form--category");
const DOM_SERVICE = document.getElementById("form--service");
const DOM_MESSAGE = document.getElementById("form--message");
const DOM_BUTTON = document.getElementById("form--submit");

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
  let parseData = {};
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
DOM_FORM.addEventListener("submit", (e) => {
  e.preventDefault();

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

      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });

  // DOM_BUTTON.setAttribute("disabled", true);
  // DOM_BUTTON.style.cursor = "not-allowed";

  // localStorage.setItem("BBA_form-data", null);
});

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