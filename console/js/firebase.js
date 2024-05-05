import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import {
  onSnapshot, collection, query, orderBy, doc, deleteDoc, addDoc, getDoc, getFirestore
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js';


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);

window.addEventListener("DOMContentLoaded", () => {
  const messagesDOM = document.getElementById("messages");
  const servicesDOM = document.getElementById("services");
  const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
  const servicesQuery = query(collection(db, 'serviceRequests'), orderBy('timestamp', 'desc'));

  onSnapshot(messagesQuery, (querySnapshot) => {
    messagesDOM.innerHTML = querySnapshot.empty? "<h2>Nu sunt mesaje noi în așteptare.</h2>" : '';

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const dateObject = data.timestamp.toDate();
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      let category = "Nesetat";
      if(data.category === "question") category = "Întrebare";
      if(data.category === "sugestion") category = "Sugestie";
      if(data.category === "other") category = "Altele";
      const formattedDate = dateObject.toLocaleDateString("ro-RO", options);

      const item = document.createElement("div");
      item.classList.add("console__item");
      item.innerHTML = `
            <div class="item__info left-vertical-hr">
              <p class="item__field"><b>Nume:</b><br> <span class="item__span">${data.name}</span></p>
              <p class="item__field"><b>Categorie:</b><br> <span class="item__span">${category}</span></p>
              <p class="item__field"><b>Email:</b><br> <span class="item__span">${data.email}</span></p>
              <p class="item__field"><b>Număr:</b><br> <span class="item__span">${data.number}</span></p>
              <p class="item__field"><b>Primit la:</b><br> <span class="item__span">${formattedDate}</span></p>
            </div>
            <p class="item__message left-vertical-hr">
            ${data.message}
            </p>
            <div class="item__actions">
              <p id="${doc.id}" class="item__delete actions__item"><i class="bi bi-trash-fill"></i></p>
            </div>
      `;
      messagesDOM.appendChild(item);

      const deleteDOM = document.getElementById(doc.id);
      deleteDOM.addEventListener("click", () => {deleteItem("messages", doc.id, data.name)});
    })
  });
  onSnapshot(servicesQuery, (querySnapshot) => {
    servicesDOM.innerHTML = querySnapshot.empty? "<h2>Nu sunt servicii în așteptare.</h2>" : '';

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const dateObject = data.timestamp.toDate();
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      const formattedDate = dateObject.toLocaleDateString("ro-RO", options);
      let service = "Nesetat";
      if(data.service === "canvas") service = "Pictură pe pânză";
      else if(data.service === "mural") service = "Pictură murală";
      else if(data.service === "interior") service = "Design interior";
      else if(data.service === "furniture") service = "Pictură mobilier";
      else if(data.service === "makeover") service = "Servicii de restaurare";
      else if(data.service === "tapestry") service = "Pictură pe tapiserie";
      else if(data.service === "mosaic") service = "Artă mozaică";
      else if(data.service === "other") service = "Altele";

      const item = document.createElement("div");
      item.classList.add("console__item");
      item.innerHTML = `
            <div class="item__info left-vertical-hr">
              <p class="item__field"><b>Nume:</b><br> <span class="item__span">${data.name}</span></p>
              <p class="item__field"><b>Serviciu:</b><br> <span class="item__span">${service}</span></p>
              <p class="item__field"><b>Email:</b><br> <span class="item__span">${data.email}</span></p>
              <p class="item__field"><b>Număr:</b><br> <span class="item__span">${data.number}</span></p>
              <p class="item__field"><b>Primit la:</b><br> <span class="item__span">${formattedDate}</span></p>
            </div>
            <p class="item__message left-vertical-hr">
            ${data.message}
            </p>
            <div class="item__actions">
              <p id="${doc.id}" class="item__delete actions__item"><i class="bi bi-trash-fill"></i></p>
            </div>
      `;
      servicesDOM.appendChild(item);

      const deleteDOM = document.getElementById(doc.id);
      deleteDOM.addEventListener("click", () => {deleteItem("serviceRequests", doc.id, data.name)});
    })
  });
});
function deleteItem(collection, docId, name){
  if(!confirm("Doriți să ștergeți mesajul proprietarului: " + name))return;
  const docRef = doc(db, collection, docId);
  deleteDoc(docRef);
  console.log("deleted", docId)
}

const formUploadDOM = document.querySelector(".upload");
formUploadDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  for(let key in productData){
    if(productData[key] === undefined){
      alert("Completează toate câmpurile " + key);
      return;
    }
  }
  try{
    productData.imageDownloadURL = await uploadImage(productData.image);
    productData.previewImageDownloadURL = await uploadImage(productData.previewImage);
    delete productData.image;
    delete productData.previewImage;
  }
  catch(err){
    console.error(err.message);
  }
  
  submitProduct(productData);
});

async function uploadImage(file) {
  try {
    const storageRef = ref(storage, 'images/' + file.name);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error.message);
  }
}


const productsCollection = collection(db, "products");

async function submitProduct(data){
  try{
    const response = await addDoc(productsCollection, data);
    console.log(response);
  }
  catch(err){
    console.error(err.message);
  }
}

async function getProductData(id){
  try{
    const docRef = doc(productsCollection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }
  catch(err){
    console.error(err.message);
  }
}