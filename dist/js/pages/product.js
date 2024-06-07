const zoomContainer = document.querySelector('.product__image-container');
const zoomImage = document.querySelector('.product__image');

zoomContainer.addEventListener('mousemove', (e) => {
  const { offsetX, offsetY } = e;
  const { offsetWidth, offsetHeight } = zoomContainer;
  const x = (offsetX / offsetWidth) * 100;
  const y = (offsetY / offsetHeight) * 100;
  zoomImage.style.transformOrigin = `${x}% ${y}%`;
});

zoomContainer.addEventListener('mouseleave', () => {
  zoomImage.style.transformOrigin = 'center center';
});
// const productContainer = document.querySelector(".product");
// const updateFlexDirection = () => {
//   productContainer.style.flexDirection = "row"; // Default to row initially

//   const zoomContainerWidth = parseFloat(getComputedStyle(zoomContainer).width);
//   const screenWidth = parseFloat(getComputedStyle(productContainer).width);
//   const ratio = zoomContainerWidth / screenWidth;
//   console.log(ratio, zoomContainerWidth, screenWidth);

//   if (ratio < 0.5) {
//       productContainer.style.flexDirection = "column";
//       document.querySelector(".product__info").style.alignSelf = "center";
//   } else {
//       document.querySelector(".product__info").style.alignSelf = "auto"; // Reset to default if needed
//   }
// };

// updateFlexDirection();

// window.addEventListener("resize", updateFlexDirection);

