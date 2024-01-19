const header = document.querySelector("#header");
const headerScroll = () => {
  const pageYOffset = window.scrollY;

  if(pageYOffset === 0){
    header.style.paddingTop =  "1rem";
    header.style.paddingBottom =  "1rem";
    header.style.height = "8rem";
    header.style.fontSize = "1.6rem"
  }
  else{
    header.style.paddingTop =  "0.2rem";
    header.style.paddingBottom =  "0.2rem";
    header.style.height = "5rem";
    header.style.fontSize = "1.4rem"
  }
}
window.addEventListener("scroll", headerScroll)
