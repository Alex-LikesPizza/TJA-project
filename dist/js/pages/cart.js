const cartContainerDOM = document.querySelector(".cart__list");

function loadProducts(){
  cartContainerDOM.innerHTML = "";
  
  const CART_ITEMS_STRING = localStorage.getItem("BBA_CART");
  const CART_ITEMS = JSON.parse(CART_ITEMS_STRING);

  CART_ITEMS.forEach(productId => {
    fetch(`/productData?id=${encodeURIComponent(productId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(productDataString => productDataString.json())
    .then(productData => {
      const listItem = document.createElement("li");
      listItem.classList.add("cart__item");
      listItem.innerHTML = `
              <div class="block-card">
                <img onclick="${() => {visitProductPage(productData.id)}}" class="block-card__image" src="${productData.previewImageDownloadURL} loading="lazy" alt="example">
                <div class="block-card__stats">
                  <h3 class="block-card__title">${productData.title}</h3>
                  <p class="block-card__description">${productData.description}</p>
                  <div class="block-card__purchase">
                    <p class="block-card__price">${productData.price}</p>
                    <button onclick="${""}" class="block-card__button button button--bordered">
                      <i class="bi bi-bookmark"></i>
                    </button>
                    <button onclick="visitProductPage('${productData.id}')}" class="block-card__button button button--bordered">
                      <i class="bi bi-zoom-in"></i><a href="./produs.html"> Vezi pagina</a>
                    </button>
                    <button onclick="removeFromCart('${productData.id}')" class="block-card__button button">
                      <i class="bi bi-dash-circle"></i> Scoate din coș
                    </button>
                  </div>
                </div>
              </div>
      `;
      cartContainerDOM.appendChild(listItem);
    })
    .catch(err => {
      console.error(err);
    })
  });
}

function removeFromCart(productId){
  const CART_STRING = localStorage.getItem("BBA_CART");
  let cart;
  if(!CART_STRING) cart = [];
  else{
    const CART_JSON = JSON.parse(CART_STRING);
    cart = [...CART_JSON];
  }
  const inCartIndex = cart.findIndex((cartProductId) => productId === cartProductId);
  if(inCartIndex !== -1)cart.splice(inCartIndex, 1);
  
  localStorage.setItem("BBA_CART", JSON.stringify(cart));

  window.updateCartCounter();
  loadProducts();
}

function visitProductPage(productId){
  localStorage.setItem("BBA_PRODUCT_VISIT_KEY", productId);
  window.open("./produs.html", "_blank");
}


loadProducts();