const header = document.querySelector("#header");
const headerScroll = () => {
  const pageYOffset = window.scrollY;

  if(pageYOffset === 0){
    header.style.padding =  "1rem";
    header.style.height = "8rem";
  }
  else{
    header.style.padding =  "1rem";
    header.style.height = "6rem";
  }
}
window.addEventListener("scroll", headerScroll)
