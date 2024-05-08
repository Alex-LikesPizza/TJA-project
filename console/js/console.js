const sections = [
  "services",
  "messages",
  "product-orders",
  "add-product",
  "products"
]
function changeTo(setting){
  const sectionDOM = document.getElementById(setting)
  const sectionButtonDOM = document.getElementById(`sidebar--${setting}`);
  for(let key of sections){
    document.getElementById(key).style.display = "none";
    document.getElementById(`sidebar--${key}`).classList.remove("sidebar__item--selected");
  }

  sectionDOM.style.display = "block";
  sectionButtonDOM.classList.add("sidebar__item--selected")
}
changeTo("products");