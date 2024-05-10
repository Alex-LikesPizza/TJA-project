const galleryDOM = document.querySelector(".products__gallery");
fetch('/productsGallery')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  })
  .then(products => {
    products.forEach(product => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
          <div class="block-card">
            <img onclick="visitProductPage('${product.id}')" class="block-card__image" src="${product.previewImageDownloadURL}" loading="lazy" alt="example">
            <div class="block-card__stats">
              <h3 class="block-card__title">${product.title}</h3>
              <p class="block-card__description">${product.description}</p>
              <div class="block-card__purchase">
                <p class="block-card__price">${product.price.toFixed(2)} lei</p>
                <button onclick="addToWishlist('${product.id}')" class="block-card__button button button--bordered" id="wishlistButton-${product.id}">
                  <i class="bi bi-bookmark"></i>
                </button>
                <button onclick="visitProductPage('${product.id}')" class="block-card__button button button--bordered">
                  <i class="bi bi-zoom-in"></i>Vezi pagina
                </button>
                <button onclick="addToCart('${product.id}')" class="block-card__button button" id="cartButton-${product.id}">
                  <i class="bi bi-plus-circle"></i> Adaugă în coș
                </button>
              </div>
            </div>
          </div>
      `;
      galleryDOM.appendChild(listItem);
    });
  })
  .catch(error => {
    console.error('Error fetching products:', error.message);
  });

function visitProductPage(productId){
  localStorage.setItem("BBA_PRODUCT_VISIT_KEY", productId);
  location.href = "./produs.html";
}

function addToCart(productId){
  const CART_STRING = localStorage.getItem("BBA_CART");
  let cart;
  if(!CART_STRING) cart = [];
  else{
    const CART_JSON = JSON.parse(CART_STRING);
    cart = [...CART_JSON];
  }
  const buttonDOM = document.getElementById("cartButton-" + productId);

  const inCartIndex = cart.findIndex((cartProductId) => productId === cartProductId);
  if(inCartIndex !== -1) {
    cart.splice(inCartIndex, 1);
    buttonDOM.innerHTML = `<i class="bi bi-plus-circle"></i> Adaugă în coș`
  }
  else{
    cart.unshift(productId);
    buttonDOM.innerHTML = `<i class="bi bi-check2-circle"></i> Adăugat cu succes`;
  }
  
  localStorage.setItem("BBA_CART", JSON.stringify(cart));

  
  window.updateCartCounter();
}

function addToWishlist(productId){
  const WISHLIST_STRING = localStorage.getItem("BBA_WISHLIST");
  let wishlist;
  if(!WISHLIST_STRING) wishlist = [];
  else{
    const WISHLIST_JSON = JSON.parse(WISHLIST_STRING);
    wishlist = [...WISHLIST_JSON];
  }
  const buttonDOM = document.getElementById("wishlistButton-" + productId);

  const inCartIndex = wishlist.findIndex((cartProductId) => productId === cartProductId);
  if(inCartIndex !== -1) {
    wishlist.splice(inCartIndex, 1);
    buttonDOM.innerHTML = `<i class="bi bi-bookmark"></i>`
  }
  else{
    wishlist.unshift(productId);
    buttonDOM.innerHTML = `<i class="bi bi-bookmark-x"></i>`;
  }
  
  localStorage.setItem("BBA_WISHLIST", JSON.stringify(wishlist));

  
  window.updateCartCounter();
}