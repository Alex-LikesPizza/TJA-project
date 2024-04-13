const titleUploadDOM = document.getElementById("upload--title");
const descriptionUploadDOM = document.getElementById("upload--description");
const priceUploadDOM = document.getElementById("upload--price");

const titlePreviewDOM = document.querySelector(".block-card__title");
const descriptionPreviewDOM = document.querySelector(".block-card__description");
const pricePreviewDOM = document.querySelector(".block-card__price");

const fileUploadDOM = document.getElementById("upload--file");
const fileImageDOM = document.getElementById("upload--image");

const productData = {
  title: undefined,
  description: undefined,
  price: undefined,
  image: new Image(),
}

titleUploadDOM.addEventListener("input", (e) => {
  titlePreviewDOM.textContent = titleUploadDOM.value;
  productData.title = titleUploadDOM.value;
});
descriptionUploadDOM.addEventListener("input", (e) => {
  descriptionPreviewDOM.textContent = descriptionUploadDOM.value;
  productData.description = descriptionUploadDOM.value;
});
priceUploadDOM.addEventListener("input", (e) => {
  let price = priceUploadDOM.value
  price = parseFloat(price);
  if(price < 0 || isNaN(price)) price = 100;
  productData.price = price;
  pricePreviewDOM.textContent =price.toFixed(2) + " lei";
});
fileUploadDOM.addEventListener("input", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  document.getElementById("upload--image-title").textContent = file.name;
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function (e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      getCompressedImageURL(img, (url) => {
        fileImageDOM.src = url;
        productData.image.src = url;
      });
    };
  };

});


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function getCompressedImageURL(image, callback){
  const maxWidth = 800;
  const maxHeight = 800;
  let width = image.width;
  let height = image.height;
  if (width > height) {
    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width *= maxHeight / height;
      height = maxHeight;
    }
  }
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  const compressedDataURL = canvas.toDataURL('image/jpeg');
  callback(compressedDataURL);
};
;
