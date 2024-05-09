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
    console.log(product);
    productTitleDOM.textContent = product.title;
    productDescriptionDOM.textContent = product.description;
    productPriceDOM.textContent = product.price.toFixed(2);
    productImageDOM.src = product.imageDownloadURL;
  })
  .catch(error => {
    console.error('Error fetching products:', error.message);
  })
}