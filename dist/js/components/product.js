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
if(getCart().includes(productId)) productButtonDOM.innerHTML = `<i class="bi bi-check2-circle"></i> Adăugat`;
if(getWishlist().includes(productId)) productButtonSaveDOM.innerHTML = `<i class="bi bi-bookmark-fill"></i>`;
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
  const buttonsDOM = document.querySelectorAll(".cartButton-" + productId);

  const inCartIndex = cart.findIndex((cartProductId) => productId === cartProductId);
  if(inCartIndex !== -1) {
    cart.splice(inCartIndex, 1);
    buttonsDOM.forEach(buttonDOM => {
      buttonDOM.innerHTML = `<i class="bi bi-plus-circle"></i> Adaugă în coș`;
    });
  }
  else{
    cart.unshift(productId);
    buttonsDOM.forEach(buttonDOM => {
      buttonDOM.innerHTML = `<i class="bi bi-check2-circle"></i> Adăugat`;
    });
  }
  
  localStorage.setItem("BBA_CART", JSON.stringify(cart));
  removeFromWishlist(productId);
  
  window.updateCartCounter();
}
function removeFromCart(productId){
  const cart = getCart();
  const buttonsDOM = document.querySelectorAll(".cartButton-" + productId);

  const inCartIndex = cart.findIndex((cartProductId) => productId === cartProductId);
  if(inCartIndex !== -1) {
    cart.splice(inCartIndex, 1);
    buttonsDOM.forEach(buttonDOM => {
      buttonDOM.innerHTML = `<i class="bi bi-plus-circle"></i> Adaugă în coș`;
    });
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
  const buttonsDOM = document.querySelectorAll(".wishlistButton-" + productId);
  
  const inWishlistIndex = wishlist.findIndex((wishlistProductId) => productId === wishlistProductId);
  if(inWishlistIndex !== -1) {
    wishlist.splice(inWishlistIndex, 1);
    buttonsDOM.forEach(buttonDOM => {
      buttonDOM.innerHTML = `<i class="bi bi-bookmark"></i>`
    });
  }
  else{
    wishlist.unshift(productId);
    buttonsDOM.forEach(buttonDOM => {
      buttonDOM.innerHTML = `<i class="bi bi-bookmark-fill"></i>`;
    });
  }
  removeFromCart(productId);
  localStorage.setItem("BBA_WISHLIST", JSON.stringify(wishlist)); 
  window.updateCartCounter();
}
function removeFromWishlist(productId){
  const wishlist = getWishlist();
  const buttonsDOM = document.querySelectorAll(".wishlistButton-" + productId);

  const inWishlistIndex = wishlist.findIndex((wishlistProductId) => productId === wishlistProductId);
  if(inWishlistIndex !== -1) {
    wishlist.splice(inWishlistIndex, 1);
    buttonsDOM.forEach(buttonDOM => {
      buttonDOM.innerHTML = `<i class="bi bi-bookmark"></i>`;
    })
  }

  localStorage.setItem("BBA_WISHLIST", JSON.stringify(wishlist));

  window.updateCartCounter();
}


const resentsIDsJSON = localStorage.getItem("BBA_resents");
const resentsIDs = resentsIDsJSON !== "null"? JSON.parse(resentsIDsJSON) : [];
const itemIndex = resentsIDs.indexOf(productId);

if(itemIndex === -1){
  console.log("not found");
}
else{
  resentsIDs.splice(itemIndex, 1);  
}
resentsIDs.unshift(productId);
resentsIDs.splice(20);
localStorage.setItem("BBA_resents", JSON.stringify(resentsIDs));