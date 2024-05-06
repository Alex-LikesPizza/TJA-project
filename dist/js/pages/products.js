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
        <li data-id="${product.id}">
          <div class="block-card">
            <a href="./produs.html">
              <img class="block-card__image" src="../images/sample1.jpg" loading="lazy" alt="example">
            </a>
            <div class="block-card__stats">
              <h3 class="block-card__title">${product.title}</h3>
              <p class="block-card__description">${product.description}</p>
              <div class="block-card__purchase">
                <p class="block-card__price">${product.price.toFixed(2)} lei</p>
                <button class="block-card__button button button--bordered">
                  <i class="bi bi-bookmark"></i>
                </button>
                <button class="block-card__button button button--bordered">
                  <i class="bi bi-zoom-in"></i><a href="./produs.html"> Vezi pagina</a>
                </button>
                <button class="block-card__button button">
                  <i class="bi bi-plus-circle"></i> Adaugă în coș
                </button>
              </div>
            </div>
          </div>
        </li>
      `;
      galleryDOM.appendChild(listItem);
    });
  })
  .catch(error => {
    console.error('Error fetching products:', error.message);
  });
