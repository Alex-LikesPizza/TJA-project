import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import {
  onSnapshot, collection, query, orderBy, doc, deleteDoc, addDoc, getDoc, getDocs, getFirestore
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js';


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);
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
function deleteItem(col, docId, name){
  if(!confirm("Doriți să ștergeți mesajul proprietarului: " + name))return;
  const docRef = doc(db, col, docId);
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
  document.querySelector(".upload__submit").setAttribute("disabled", true);
  try{
    productData.imageDownloadURL = await uploadImage(productData.image);
    productData.previewImageDownloadURL = await uploadImage(productData.previewImage);
    delete productData.image;
    delete productData.previewImage;
  }
  catch(err){
    console.error(err.message);
  }
  
  submitProduct(productData)
  .then(() => {
    location.href = location.href;
  })
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
const productsContainerDOM = document.querySelector(".products-container");
const productsRef = collection(db, 'products');

async function displayProducts() {
  const querySnapshot = await getDocs(productsRef);
  productsContainerDOM.innerHTML = querySnapshot.empty? "<h2>Nu aveți nici un produs.</h2>" : "";
  
  querySnapshot.forEach((doc) => {
    const product = doc.data();
    const li = document.createElement('li');
    li.classList.add('product__container');
    li.innerHTML = `
      <div class="block-card block-card--wide block-card--center">
        <div class="upload__image-label">
          <img class="block-card__image upload--image" src="${product.previewImageDownloadURL}" alt="${product.title}">
        </div>
        <div class="block-card__stats">
          <h3 class="block-card__title">${product.title}</h3>
          <p class="block-card__description">${product.description}</p>
          <div class="block-card__purchase">
            <p class="block-card__price">${product.price.toFixed(2)} lei</p>
            <button onclick="visitProductPage('${doc.id}')" class="block-card__button button button--bordered">
              <i class="bi bi-zoom-in"></i>Vezi pagina
            </button>
          </div>
        </div>
      </div>
      <div class="product__delete" data-id="${doc.id}" data-title="${product.title}">
        <i class="bi bi-trash-fill"></i>
      </div>`;
    productsContainerDOM.appendChild(li);
  });

  const deleteButtons = document.querySelectorAll('.product__delete');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const docId = button.dataset.id;
      const title = button.dataset.title;
      await deleteProduct(docId, title);
    });
  });
}
async function deleteProduct(docId, title) {
  if(!confirm(`Doriți să ștergeți "${title}" din data de baze?`)) return;
  try {
    await deleteDoc(doc(db, 'products', docId));
    await displayProducts();

  } catch (error) {
    console.error('Error deleting document: ', error);
  }
}

displayProducts();

const productRequestsListDOM = document.querySelector(".product-orders__list");
const productRequestsQuery = query(collection(db, 'productRequests'), orderBy('timestamp', 'desc'));

onSnapshot(productRequestsQuery, async (querySnapshot) => {
  const promises = [];
  productRequestsListDOM.innerHTML = querySnapshot.empty? "<h2>Nu sunt comenzi în așteptare.</h2>" : '';
  if(querySnapshot.empty) return;
  console.log(querySnapshot);
  querySnapshot.forEach(async (snapDoc) => {
    const data = {id: snapDoc.id, ...snapDoc.data()};
    const dateObject = data.timestamp.toDate();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formattedDate = dateObject.toLocaleDateString("ro-RO", options);
    const productIDs = data.productIDs;
    const productPromises = productIDs.map((productID) => {
      const productRef = doc(db, "products", productID);
      return getDoc(productRef).then((productSnapshot) => {
        const productData = { id: productSnapshot.id, ...productSnapshot.data() };
        return `
          <li class="inner-product__list-item">
              <img class="inner-product__image" src="${productData.previewImageDownloadURL}">
              <div class="inner-product__title">${productData.title}</div>
              <div class="inner-product__price">${productData.price.toFixed(2)} lei</div>
          </li>
        `;
      });
    });

    promises.push(...productPromises);
    const item = document.createElement("li");
    item.classList.add("product-orders__list-item");
    Promise.all(productPromises).then((products) => {
      const productsTotalPrice = products.reduce((acc, curr) => {
        const priceMatch = curr.match(/<div class="inner-product__price">(.+?) lei<\/div>/);
        if (priceMatch && priceMatch[1]) {
          return acc + parseFloat(priceMatch[1]);
        }
        return acc;
      }, 0);
      item.innerHTML = `
        <div class="product-orders__data">
          <h2 class="inner-product__title">Informații:</h2>
          <div class="product-orders__column">
            <div class="product-orders__field">Nume: <span class="product-orders__field-value">${data.name}</span></div>
            <div class="product-orders__field">Email: <span class="product-orders__field-value">${data.email}</span></div>
            <div class="product-orders__field">Telefon: <span class="product-orders__field-value">${data.number}</span></div>
          </div>
          <div class="product-orders__column">
            <div class="product-orders__field">Adresa: <span class="product-orders__field-value">${data.address}</span></div>
            <div class="product-orders__field">Cod Poștal: <span class="product-orders__field-value">${data.code}</span></div>
            <div class="product-orders__field">Data: <span class="product-orders__field-value">${formattedDate}</span></div>
          </div>
          ${data.message? `<div class="product-orders__field">Mesaj: <span class="product-orders__field-value">${data.message}</span></div>` : ''}
        </div>
        <div class="inner-product">
          <h2 class="inner-product__list-title">Produse solicitate</h2>
          <ul class="inner-product__list">
            ${products.join('')}
          </ul>
          <h2 class="inner-product__list-title">Total: <span class="inner-product__total">${(productsTotalPrice * 1.1).toFixed(2)} lei (+TVA)</span></h2>
        </div>
        <div class="product__delete order-delete" data-id="${data.id}">
          <i class="bi bi-trash-fill"></i>
        </div>
      `;
      productRequestsListDOM.appendChild(item);
    });
  });

  await Promise.all(promises);

  document.querySelectorAll(".order-delete").forEach(button => {
    const orderId = button.dataset.id;
    button.addEventListener("click", () => {deleteOrder(orderId)});
  })
});

async function deleteOrder(id) {
  try {
    const orderRef = doc(db, "productRequests", id);
      const orderSnapshot = await getDoc(orderRef);
      const orderData = orderSnapshot.data();
      await deleteDoc(orderRef);

      const productIDs = orderData.productIDs;
      const deleteProductPromises = productIDs.map(productId => deleteDoc(doc(db, "products", productId)));

      await Promise.all(deleteProductPromises);
  } catch (error) {
      console.error("Error deleting order:", error);
  }
}
