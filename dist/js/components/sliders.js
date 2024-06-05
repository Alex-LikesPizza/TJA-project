const calculateWidth = () => parseFloat(getComputedStyle(document.querySelector(".card")).width);
const sliderFactory = (id, props) =>
  new Splide(id, {
    lazyLoading: true,
    perMove: 2,
    pagination: false,
    gap: "1rem",

    ...props,
  });
  

const resentsSlider = document.querySelector("#slider--resents");
const recommendedSlider = document.querySelector("#slider--recommended");
const similarSlider = document.querySelector("#slider--similar");
const testimonialsSlider = document.querySelector("#slider--testimonials");

if(recommendedSlider !== null)
  sliderFactory("#slider--recommended", {fixedWidth: calculateWidth()}).mount();
if(similarSlider !== null)
  sliderFactory("#slider--similar", {fixedWidth: calculateWidth()}).mount();
if(testimonialsSlider !== null){
  sliderFactory("#slider--testimonials", {
    type: "carousel",
    pagination: true,
    perMove: 1,
    perPage: 1,
    gap: null,
    rewind: true,
    autoplay: true,
    interval: 12000,
  }).mount();
}


function hideSlider(str){
  const elem = document.querySelector("#slider--" + str)
  if(!elem) return;
  elem.style.display = "none";
}


if (resentsSlider) {
  const resentsIDsJSON_slider = localStorage.getItem("BBA_resents");
  const resentsIDs_slider = resentsIDsJSON_slider !== "null" ? JSON.parse(resentsIDsJSON_slider) : [];

  if (resentsIDs_slider.length === 0) {
    hideSlider("resents");
  }
  const sliderList = document.getElementById("slide-resent");

  Promise.all(resentsIDs_slider.map(productId =>
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
        return response.json().then(product => ({ productId, product }));
      })
      .catch(error => {
        console.error('Error fetching products:', error.message);
      })
  )).then(products => {
    products = products.filter(item => item !== null);
    products.sort((a, b) => resentsIDs_slider.indexOf(a.productId) - resentsIDs_slider.indexOf(b.productId));

    products.forEach(({ productId, product }) => {
      const title = product.title;
      const price = product.price.toFixed(2);
      const imageURL = product.previewImageDownloadURL;
      sliderList.innerHTML += newSliderItem(title, price, imageURL, productId);
    });

    sliderFactory("#slider--resents", { fixedWidth: calculateWidth() }).mount();
  });
}
if(recommendedSlider){
  const recommendedIDsJSON_slider = localStorage.getItem("BBA_recommended");
  const recommendedIDs_slider = recommendedIDsJSON_slider !== "null" ? JSON.parse(recommendedIDsJSON_slider) : [];

}
function newSliderItem(title, price, imageURL, productId){
  return ` 
  <li class="splide__slide">
    <div class="card">
      <a class="card__image" onclick="visitProductPage_slider('${productId}')">
        <img  class="card__image" src="${imageURL}" loading="lazy" alt="example">
      </a>
      <h3 class="card__title">${title}</h3>
      <div class="card__actions">
        <button onclick="addToCart('${productId}')" class="button button--monochrome-bordered cartButton-${productId}">
          <i class="bi bi-bookmark"></i>
        </button>
        <p class="card__price">${price} lei</p>
        <button onclick="addToWishlist('${productId}')" class="button button--monochrome-bordered wishlistButton-${productId}">
          <i class="bi bi-plus-circle"></i>
        </button>
      </div>
    </div>
  </li>
`
}

function getCart(){
  const CART_STRING = localStorage.getItem("BBA_CART");
  let cart;
  if(!CART_STRING) cart = [];
  else{
    cart = JSON.parse(CART_STRING);
  }
  return cart;
}

hideSlider("recommended");
hideSlider("similar");