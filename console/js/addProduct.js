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
  image: undefined,
  previewImage: undefined,
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
  productData.image = file;
  

  document.getElementById("upload--image-title").textContent = file.name;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  
  reader.onload = function (e) {
    image.src = e.target.result;
    image.onload = () => {
      fileModifier();
    };
  };
});

const scaleUploadDOM = document.getElementById("upload--file-scale");
const offsetXUploadDOM = document.getElementById("upload--file-alignment-left");
const offsetYUploadDOM = document.getElementById("upload--file-alignment-top");

function fileModifier(){
  if(!image.src) return;
  const scale = parseInt(scaleUploadDOM.value);
  const offsetX = parseInt(offsetXUploadDOM.value);
  const offsetY = parseInt(offsetYUploadDOM.value);
  getModifiedImage((url, file) => {
    fileImagesDOM.forEach(image => {
      image.src = url;
    });
    productData.previewImage = file;
  }, {scale, offsetX, offsetY});
  
}
scaleUploadDOM.addEventListener("input", fileModifier);
offsetXUploadDOM.addEventListener("input", fileModifier);
offsetYUploadDOM.addEventListener("input", fileModifier);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function getModifiedImage(callback, modifier = {scale: 100, offsetX: 50, offsetY: 50}){
  const canvasSize = 800;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  let imageSize = Math.min(image.width, image.height);
  const scale = ((modifier.scale / 100) / 2) + 0.5;
  const rand = imageSize / canvasSize;

  imageSize *= scale;

  const offsetX = (image.width - canvasSize * rand * scale) * modifier.offsetX / 100;
  const offsetY = (image.height - canvasSize * rand * scale) * modifier.offsetY / 100;

  ctx.drawImage(image, offsetX, offsetY, imageSize, imageSize, 0, 0, canvas.width, canvas.height);
  let compressedDataURL = canvas.toDataURL('image/jpeg');
  let file;
  canvas.toBlob((blob) => {
    file = new File([blob], 'canvas_image.png', { type: 'image/png' });
  });
  callback(compressedDataURL, file);
};