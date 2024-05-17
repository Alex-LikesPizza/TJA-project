const productId = localStorage.getItem("BBA_PRODUCT_VISIT_KEY");
const productTitleDOM = document.getElementById("product--title");
const productDescriptionDOM = document.getElementById("product--description");
const productPriceDOM = document.getElementById("product--price");
const productImageDOM = document.getElementById("product--image");

fetchProductData();
function fetchProductData(){
  if(!productId){
    location.href = "./products.html";
    return;
  }
  fetch(`/productData?id=${encodeURIComponent(productId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  })
  .then(product => {
    productTitleDOM.textContent = product.title;
    productDescriptionDOM.textContent = product.description;
    productPriceDOM.textContent = product.price.toFixed(2);
    productImageDOM.src = product.imageDownloadURL;
  })
  .catch(error => {
    console.error('Error fetching products:', error.message);
  })
}

const productButtonDOM = document.querySelector("#purchase-button");
const productButtonSaveDOM = document.querySelector("#save-button");
productButtonDOM.addEventListener("click", () => {addToCart(productId)});
productButtonSaveDOM.addEventListener("click", () => {addToWishlist(productId)});

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
    productButtonDOM.innerHTML = `<i class="bi bi-plus-circle"></i> Adaugă în coș`;
  }
  else{
    cart.unshift(productId);
    productButtonDOM.innerHTML = `<i class="bi bi-check2-circle"></i> Adăugat`;
    productButtonSaveDOM.innerHTML = `<i class="bi bi-bookmark"></i>`;
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
    productButtonSaveDOM.innerHTML = `<i class="bi bi-bookmark"></i>`;
  }
  else{
    wishlist.unshift(productId);
    productButtonSaveDOM.innerHTML = `<i class="bi bi-bookmark-fill"></i>`;
    productButtonDOM.innerHTML = `<i class="bi bi-plus-circle"></i> Adaugă în coș`;
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
}
