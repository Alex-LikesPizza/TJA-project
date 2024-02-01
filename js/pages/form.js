import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js'
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js'


import firebaseConfig from "../keys.js";
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);

const messagesRef = collection(database, "messages");
const serviceRequestsRef = collection(database, "serviceRequests");



const DOM_FORM = document.getElementById("form");
const DOM_NAME = document.getElementById("form--name");
const DOM_EMAIL = document.getElementById("form--email");
const DOM_NUMBER = document.getElementById("form--tel");
const DOM_CATEGORY = document.getElementById("form--category");
const DOM_SERVICE = document.getElementById("form--service");
const DOM_MESSAGE = document.getElementById("form--message");

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
})
DOM_FORM.addEventListener("submit", (e) => {
  e.preventDefault();

  data.getData();
  if(data.category !== "service"){
    addDoc(messagesRef, {
      name: data.name,
      email: data.email,
      number: data.number,
      category: data.category,
      message: data.message
    })
      .then(docRef => {
        // docRef - data ref
        console.log(`%c #${docRef.id} a fost trimis cu succes`, "color: green");
        DOM_FORM.reset();
      })
      .catch(err => {
        alert("Nu sa putut conecta cu baza de date. Încercați mai târziu.");
        console.error(err);
      });
  }
  else{
    addDoc(serviceRequestsRef, {
      name: data.name,
      email: data.email,
      number: data.number,
      service: data.service,
      message: data.message
    })
      .then(docRef => {
        // docRef - data ref
        console.log(`%c #${docRef.id} a fost trimis cu succes`, "color: green");
        DOM_FORM.reset();
      })
      .catch(err => {
        alert("Nu sa putut conecta cu baza de date. Încercați mai târziu.");
        console.error(err);
      });
  }
});


