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

const productButtonDOM = document.querySelector(".product__purchase");
productButtonDOM.setAttribute("id", "button-" + productId);
productButtonDOM.addEventListener("click", () => {addToCart(productId)});

function addToCart(productId){
  const CART_STRING = localStorage.getItem("BBA_CART");
  let cart;
  if(!CART_STRING) cart = [];
  else{
    const CART_JSON = JSON.parse(CART_STRING);
    cart = [...CART_JSON];
  }
  const isInCart = cart.findIndex((cartProductId) => productId === cartProductId) !== -1;
  if(isInCart) return;
  cart.unshift(productId);
  localStorage.setItem("BBA_CART", JSON.stringify(cart));

  const buttonDOM = document.getElementById("button-" + productId);
  buttonDOM.innerHTML = `<i class="bi bi-check2-circle"></i> Adăugat cu succes`;
  window.updateCartCounter();
}