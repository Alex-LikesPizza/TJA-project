import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { getFirestore, onSnapshot, collection, query, orderBy, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
      if(category === "question") category = "Întrebare";
      if(category === "sugestion") category = "Sugestie";
      if(category === "other") category = "Altele";
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
      deleteDOM.addEventListener("click", () => {deleteItem("messages", doc.id)});
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
      deleteDOM.addEventListener("click", () => {deleteItem("serviceRequests", doc.id)});
    })
  });
});

function deleteItem(collection, docId){
  const docRef = doc(db, collection, docId);
  deleteDoc(docRef);
  console.log("deleted", docId)
}