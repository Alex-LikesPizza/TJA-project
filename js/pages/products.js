function calculateWidth(){
  const elementWidth = parseFloat(getComputedStyle(document.querySelector(".card")).width);
  const perPage = Math.floor((window.innerWidth - 64) / elementWidth);
  return perPage;
}

function sliderFactory(id, props){
  const slider = new Splide(id, {
    perPage: calculateWidth(),
    lazyLoading: true,
    omitEnd: true,
    pagination: false,

    ...props,
  });

  slider.on("resize", () => {
    slider.options.perPage = calculateWidth();
    slider.refresh();
  });

  return slider;
}
const sliderRecents = sliderFactory("#slider--recents", {});
sliderRecents.mount();

