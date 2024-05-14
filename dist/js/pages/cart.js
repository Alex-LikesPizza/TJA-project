const cartDOM = document.querySelector(".cart");
const wishlistDOM = document.querySelector(".wishlist")
let totalProductPrice = 0;

function loadProducts(){
  const CART_ITEMS_STRING = localStorage.getItem("BBA_CART");
  const CART_ITEMS = JSON.parse(CART_ITEMS_STRING);
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
  const WISHLIST_ITEMS = JSON.parse(WISHLIST_ITEMS_STRING);
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
  loadProducts();
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

  loadProducts();
  loadWishlist();
}


function visitProductPage(productId){
  localStorage.setItem("BBA_PRODUCT_VISIT_KEY", productId);
  window.open("./produs.html", "_blank");
}
loadProducts();
loadWishlist();

const formNameDOM = document.getElementById("cart-modal--name");
const formEmailDOM = document.getElementById("cart-modal--email");
const formPhoneDOM = document.getElementById("cart-modal--phone");
const formMessageDOM = document.getElementById("cart-modal--message");
const formSubmitButtonDOM = document.getElementById("cart-modal--submit");

function submitForm(){
  const formData = {
    name: formNameDOM.value,
    email: formEmailDOM.value,
    phone: formPhoneDOM.value,
    message: formMessageDOM.value,
  }
  
}
formSubmitButtonDOM.addEventListener("click", submitForm);