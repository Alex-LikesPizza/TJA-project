const header = document.querySelector("#header");
const headerScroll = () => {
  const pageYOffset = window.scrollY;

  if(pageYOffset === 0){
    header.style.position = "absolute";
    header.style.padding =  "1rem";
    header.style.height = "8rem";
  }
  else{
    header.style.position = "sticky";
    header.style.padding =  "1rem";
    header.style.height = "6rem";
  }
}
setInterval(headerScroll, 10);
