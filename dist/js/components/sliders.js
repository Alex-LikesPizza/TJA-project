const calculateWidth = () => parseFloat(getComputedStyle(document.querySelector(".card")).width);


const sliderFactory = (id, props) =>
  new Splide(id, {
    lazyLoading: true,
    perMove: 2,
    pagination: false,
    fixedWidth: calculateWidth(),
    gap: "1rem",

    ...props,
  });

if(document.querySelector("#slider--recents") != null)
  sliderFactory("#slider--recents", {}).mount();
if(document.querySelector("#slider--recomended") != null)
  sliderFactory("#slider--recomended", {}).mount();
if(document.querySelector("#slider--similar") != null)
  sliderFactory("#slider--similar", {}).mount();
;
