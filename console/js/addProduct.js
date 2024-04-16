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

function getCompressedImageURL(callback, modifier = {scale: 100, offsetX: 0, offsetY: 0}){
  const canvasSize = 800;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  let imageSize = Math.min(image.width, image.height);
  const rand = imageSize / canvasSize;
  const scale = ((modifier.scale / 100));


  imageSize *= scale;

  const offsetX = (image.width - canvasSize * rand) * modifier.offsetX / 100;
  const offsetY = (image.height - canvasSize * rand) * modifier.offsetY / 100;

  console.log(image.height, canvasSize, image.height - canvasSize);

  
  

  ctx.drawImage(image, offsetX, offsetY, imageSize, imageSize, 0, 0, canvas.width, canvas.height);
  const compressedDataURL = canvas.toDataURL('image/jpeg');
  callback(compressedDataURL);
};