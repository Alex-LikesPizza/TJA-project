const titleUploadDOM = document.getElementById("upload--title");
const descriptionUploadDOM = document.getElementById("upload--description");
const priceUploadDOM = document.getElementById("upload--price");

const titlePreviewDOM = document.querySelector(".block-card__title");
const descriptionPreviewDOM = document.querySelector(".block-card__description");
const pricePreviewDOM = document.querySelector(".block-card__price");

const fileUploadDOM = document.getElementById("upload--file");
const fileImagesDOM = document.querySelectorAll(".upload--image");

const productData = {
  title: undefined,
  description: undefined,
  price: undefined,
  scale: undefined,
  offsetX: undefined,
  offsetY: undefined,
  imageUrl: undefined,
  uncompressedImageUrl: undefined,
}
const image = new Image();

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
    image.src = e.target.result;
    productData.uncompressedImageUrl = e.target.result;
    image.onload = () => {
      getCompressedImageURL((url) => {
          fileImagesDOM.forEach(image => {
            image.src = url;
          });
          productData.imageUrl = url;
      });
    };
  };
});

const scaleUploadDOM = document.getElementById("upload--file-scale");
const offsetXUploadDOM = document.getElementById("upload--file-alignment-left");
const offsetYUploadDOM = document.getElementById("upload--file-alignment-top");

function fileModifier(){
  const scale = parseInt(scaleUploadDOM.value);
  const offsetX = parseInt(offsetXUploadDOM.value);
  const offsetY = parseInt(offsetYUploadDOM.value);
  getCompressedImageURL((url) => {
    fileImagesDOM.forEach(image => {
      image.src = url;
    });
    productData.imageUrl = url;
  }, {scale, offsetX, offsetY});
  
}
scaleUploadDOM.addEventListener("input", fileModifier);
offsetXUploadDOM.addEventListener("input", fileModifier);
offsetYUploadDOM.addEventListener("input", fileModifier);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function getCompressedImageURL(callback, modifier = {scale: 0, offsetX: 0, offsetY: 0}){
  const maxWidth = 800;
  const maxHeight = 800;
  let width = image.width;
  let height = image.height;
  
  const offsetX = (scaledWidth - width) * (modifier.offsetX / 100);
  const offsetY = (scaledHeight - height) * (modifier.offsetY / 100);
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
  
  const scaledWidth = width * (1 + modifier.scale / 100);
  const scaledHeight = height * (1 + modifier.scale / 100);


  ctx.drawImage(image, -offsetX, -offsetY, scaledWidth, scaledHeight);
  const compressedDataURL = canvas.toDataURL('image/jpeg');
  callback(compressedDataURL);
};