const calculateWidth = () => parseFloat(getComputedStyle(document.querySelector(".card")).width);


const sliderFactory = (id, props) =>
  new Splide(id, {
    lazyLoading: true,
    perMove: 2,
    pagination: false,
    gap: "1rem",

    ...props,
  });

if(document.querySelector("#slider--recents") !== null)
  sliderFactory("#slider--recents", {fixedWidth: calculateWidth()}).mount();
if(document.querySelector("#slider--recomended") !== null)
  sliderFactory("#slider--recomended", {fixedWidth: calculateWidth()}).mount();
if(document.querySelector("#slider--similar") !== null)
  sliderFactory("#slider--similar", {fixedWidth: calculateWidth()}).mount();
if(document.querySelector("#slider--testimonials") !== null){
  sliderFactory("#slider--testimonials", {
    type: "carousel",
    pagination: true,
    perMove: 1,
    perPage: 1,
    gap: null,
    rewind: true,
    autoplay: true,
    interval: 5000,
  }).mount();
}

let hiddenSliders = ["recents", "recomended", "similar"];

function hideSliders(){
  for(let str of hiddenSliders){
    const elem = document.querySelector("#slider--" + str)
    if(elem === null) continue;
    elem.style.display = "none";
  }
}
hideSliders();