const titleUploadDOM = document.getElementById("upload--title");
const keywordsUploadDOM = document.getElementById("upload--keywords");
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
  keywords: undefined,
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

keywordsUploadDOM.addEventListener("input", (e) => {
  function standardizeWord(str) {
    str.trim();
    const diacriticsMap = {
        'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ş': 's', 'ț': 't', 'ţ': 't',
        'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ş': 'S', 'Ț': 'T', 'Ţ': 'T'
    };
    return str.replace(/[ăâîșşțţĂÂÎȘŞȚŢ]/g, function(match) {
        return diacriticsMap[match];
    });
  }

  const keywords = keywordsUploadDOM.value.trim().split(",");
  const cleanKeywords = [];
  keywords.forEach(keyword => {
    keyword = standardizeWord(keyword);
    if(!keyword) return;
    cleanKeywords.push(keyword);
  });

  productData.keywords = cleanKeywords;
  if(!cleanKeywords || cleanKeywords.length === 0) productData.keywords = undefined;
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
    renameImages();
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
    file = new File([blob], "c_img.png", { type: 'image/png' });
    callback(compressedDataURL, file);
  });
};


function renameImages(){
  let imageName = productData.image.name;
  let imagePreviewName = productData.image.name;
  let code = generateRandomCode(8);
  let beenUpdated = imageName.slice(-15, -12) === "-ID";
  imageName = imageName.slice(0, beenUpdated? -15 : -4) + "-ID" + code + ".png";
  imagePreviewName = imagePreviewName.slice(0, beenUpdated? -15 : -4) + "-preview" + "-ID" + code + ".png"

  productData.image = new File([productData.image], imageName, { type: productData.image.type });
  productData.previewImage = new File([productData.previewImage], imagePreviewName, { type: productData.previewImage.type });

}

function generateRandomCode(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}