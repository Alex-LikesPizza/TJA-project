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

