const cartDOM = document.querySelector(".cart");
const wishlistDOM = document.querySelector(".wishlist")
let totalProductPrice = 0;

function loadCart(){
  const CART_ITEMS_STRING = localStorage.getItem("BBA_CART");
  const CART_ITEMS = CART_ITEMS_STRING? JSON.parse(CART_ITEMS_STRING) : [];
  totalProductPrice = 0;
  
  if(!CART_ITEMS || CART_ITEMS.length === 0){
    cartDOM.innerHTML = `
    <h2 class="cart__pre-title">Cart</h2>
    <div class='cart__empty'>Nu aveți nimic în Cart...</div>`
  }
  else{
    cartDOM.innerHTML = `
    <h2 class="cart__pre-title">Cart</h2>
    <ul class="cart__list"></ul>`;
  }
  
  const cartContainerDOM = document.querySelector(".cart__list");
  CART_ITEMS.forEach(productId => {
    fetch(`/productData?id=${encodeURIComponent(productId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(productDataString => productDataString.json())
    .then(productData => {
      totalProductPrice += productData.price;
      const listItem = document.createElement("li");
      listItem.classList.add("cart__item");
      listItem.innerHTML = `
              <div class="block-card">
                <img onclick="visitProductPage('${productData.id}')" class="block-card__image" src="${productData.previewImageDownloadURL} loading="lazy" alt="example">
                <div class="block-card__stats">
                  <h3 class="block-card__title">${productData.title}</h3>
                  <p class="block-card__description">${productData.description}</p>
                  <div class="block-card__purchase">
                    <p class="block-card__price">${productData.price.toFixed(2)} lei</p>
                    <button onclick="addToWishlist('${productData.id}')" class="block-card__button button button--bordered">
                      <i class="bi bi-bookmark"></i>
                    </button>
                    <button onclick="visitProductPage('${productData.id}')" class="block-card__button button button--bordered">
                      <i class="bi bi-zoom-in"></i>Vezi pagina
                    </button>
                    <button onclick="removeFromCart('${productData.id}')" class="block-card__button button">
                      <i class="bi bi-dash-circle"></i> Scoate din coș
                    </button>
                  </div>
                </div>
              </div>
      `;
      cartContainerDOM.appendChild(listItem);
      updateTotal();
    })
    .catch(err => {
      console.error(err);
    })
  });
  updateTotal();
}
function updateTotal(){
  const preTotalDOM = document.getElementById("cart__pre-total");
  const totalDOM = document.getElementById("cart__total");
  const TVA = 0.1;
  preTotalDOM.textContent = totalProductPrice.toFixed(2);
  totalDOM.textContent = (totalProductPrice * (1 + TVA)).toFixed(2);
}
function loadWishlist(){
  const WISHLIST_ITEMS_STRING = localStorage.getItem("BBA_WISHLIST");
  const WISHLIST_ITEMS = WISHLIST_ITEMS_STRING? JSON.parse(WISHLIST_ITEMS_STRING) : [];
  if(!WISHLIST_ITEMS || WISHLIST_ITEMS.length === 0){
    wishlistDOM.style.display = "none";
  }
  else{
    wishlistDOM.style.display = "block";
  }
  const wishlistContainerDOM = document.querySelector(".wishlist__list");
  wishlistContainerDOM.innerHTML = "";
  WISHLIST_ITEMS.forEach(productId => {
    fetch(`/productData?id=${encodeURIComponent(productId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(productDataString => productDataString.json())
    .then(productData => {
      const listItem = document.createElement("li");
      listItem.classList.add("wishlist__item");
      listItem.innerHTML = `
              <div class="block-card">
                <img onclick="visitProductPage('${productData.id}')" class="block-card__image" src="${productData.previewImageDownloadURL} loading="lazy" alt="example">
                <div class="block-card__stats">
                  <h3 class="block-card__title">${productData.title}</h3>
                  <p class="block-card__description">${productData.description}</p>
                  <div class="block-card__purchase">
                    <p class="block-card__price">${productData.price.toFixed(2)} lei</p>
                    <button onclick="removeFromWishlist('${productData.id}')" class="block-card__button button button--bordered">
                      <i class="bi bi-bookmark-fill"></i>
                    </button>
                    <button onclick="visitProductPage('${productData.id}')" class="block-card__button button button--bordered">
                      <i class="bi bi-zoom-in"></i>Vezi pagina
                    </button>
                    <button onclick="addToCart('${productData.id}')" class="block-card__button button">
                      <i class="bi bi-plus-circle"></i> Adaugă în coș
                    </button>
                  </div>
                </div>
              </div>
      `;
      wishlistContainerDOM.appendChild(listItem);
    })
    .catch(err => {
      console.error(err);
    })
  });
}

function getCart(){
  const CART_STRING = localStorage.getItem("BBA_CART");
  let cart;
  if(!CART_STRING) cart = [];
  else{
    const CART_JSON = JSON.parse(CART_STRING);
    cart = [...CART_JSON];
  }
  return cart;
}
function addToCart(productId){
  const cart = getCart();

  const inCartIndex = cart.findIndex((cartProductId) => productId === cartProductId);
  if(inCartIndex !== -1) {
    cart.splice(inCartIndex, 1);
  }
  else{
    cart.unshift(productId);
  }
  
  localStorage.setItem("BBA_CART", JSON.stringify(cart));
  removeFromWishlist(productId);
  
  window.updateCartCounter();
}
function removeFromCart(productId){
  const cart = getCart();

  const inCartIndex = cart.findIndex((cartProductId) => productId === cartProductId);
  if(inCartIndex !== -1) {
    cart.splice(inCartIndex, 1);
  }

  localStorage.setItem("BBA_CART", JSON.stringify(cart));

  window.updateCartCounter();
  loadCart();
  loadWishlist();
}

function getWishlist(){
  const WISHLIST_STRING = localStorage.getItem("BBA_WISHLIST");
  let wishlist;
  if(!WISHLIST_STRING) wishlist = [];
  else{
    const WISHLIST_JSON = JSON.parse(WISHLIST_STRING);
    wishlist = [...WISHLIST_JSON];
  }
  return wishlist;
}

function addToWishlist(productId){
  let wishlist = getWishlist();
  
  const inWishlistIndex = wishlist.findIndex((wishlistProductId) => productId === wishlistProductId);
  if(inWishlistIndex !== -1) {
    wishlist.splice(inWishlistIndex, 1);
  }
  else{
    wishlist.unshift(productId);
  }

  localStorage.setItem("BBA_WISHLIST", JSON.stringify(wishlist)); 
  removeFromCart(productId);
}
function removeFromWishlist(productId){
  const wishlist = getWishlist();

  const inWishlistIndex = wishlist.findIndex((wishlistProductId) => productId === wishlistProductId);
  if(inWishlistIndex !== -1) {
    wishlist.splice(inWishlistIndex, 1);
  }

  localStorage.setItem("BBA_WISHLIST", JSON.stringify(wishlist));

  loadCart();
  loadWishlist();
}


function visitProductPage(productId){
  localStorage.setItem("BBA_PRODUCT_VISIT_KEY", productId);
  window.open("./produs.html", "_blank");
}
loadCart();
loadWishlist();

const formNameDOM = document.getElementById("cart-modal--name");
const formEmailDOM = document.getElementById("cart-modal--email");
const formPhoneDOM = document.getElementById("cart-modal--phone");
const formAddressDOM = document.getElementById("cart-modal--address");
const formCodeDOM = document.getElementById("cart-modal--code");
const formMessageDOM = document.getElementById("cart-modal--message");
const formSubmitDOM = document.getElementById("cart-modal--submit");
const formDOM = document.getElementById("cart-modal");

function getData() {
  return {
    name: formNameDOM.value,
    email: formEmailDOM.value,
    number: formPhoneDOM.value,
    address: formAddressDOM.value,
    code: formCodeDOM.value,
    message: formMessageDOM.value,
  };
}

let data = {
  name: null,
  email: null,
  number: null,
  address: null,
  code: null,
  message: null,
}

function submitForm(e){
  e.preventDefault();

  let cart = JSON.parse(localStorage.getItem("BBA_CART"));
  if(cart.length === 0) alert("Nu aveți nici un produs în coș");
  let data = getData();
  for(const key in data){
    if(key === "message") continue;
    if(data[key].trim() === ""){
      alert("Vă rugăm să umpleți toate rândurile");
      return;
    };
  }
  data.productIDs = [...cart];
  const phoneRegex = /^\+?\d(?:\s*\d){8,}$/;
  if (!phoneRegex.test(data.number)) {
    alert("Vă rugăm să introduceți un număr valid");
    return;
  } 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(data.email)){
    alert("Vă rugăm să introduceți o adresă de email validă");
    return;
  }
  const addressRegex = /^.{5,}$/;
  if (!addressRegex.test(data.address)) {
    alert("Vă rugăm să introduceți o adresă validă");
    return;
  }

  formSubmitDOM.setAttribute("disabled", true);
  fetch("/productOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }
  )
  .then(response => response.json)
  .then(data => {
    formSubmitDOM.removeAttribute("disabled");
    localStorage.setItem("BBA_CART", "");
    loadCart();
    closeModal()
  })
  .catch(err => {
    console.error(err)
  })

}
formDOM.addEventListener("submit", submitForm);