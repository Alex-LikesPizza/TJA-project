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
if(!header.classList.contains("header--static")){
  window.addEventListener("scroll", headerScroll);
  window.addEventListener("DOMContentLoaded", headerScroll)
}


const more = document.querySelector(".more");
function moreToggle(){
  more.classList.toggle("more--closed");
}


let cartCountDOM = document.createElement("div");
cartCountDOM.classList.add("header__cart-after");
document.getElementById("header__cart").appendChild(cartCountDOM);
cartCountDOM = document.querySelector(".header__cart-after");
updateCartCounter();
function updateCartCounter(){
  const CART_STRING = localStorage.getItem("BBA_CART");
  const CART_JSON = CART_STRING !== ""? JSON.parse(CART_STRING) : [];
  let count = CART_JSON.length;

  cartCountDOM.textContent = count;
  if(count === 0) cartCountDOM.style.display = "none";
  else{
    cartCountDOM.style.display = "block";
  }
}