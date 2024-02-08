const copyToClipboard = async text => {
  try{
    await navigator.clipboard.writeText(text);
  }
  catch{
    console.log(error.message);
  }
}; 

function handleEmailClick(id, text) {
  const DOM_ELEMENT = document.getElementById(id);
  const afterContent = document.createElement('span');
  afterContent.classList.add("contacts__item-after")
  afterContent.textContent = "Click & copy";
  DOM_ELEMENT.appendChild(afterContent);
  
  function clickHandler() {
      copyToClipboard(text);
      afterContent.textContent = "Copiat";
      afterContent.removeEventListener("click", clickHandler);

      setTimeout(() => {
          afterContent.addEventListener("click", clickHandler);
          afterContent.textContent = "Click to copy";
      }, 1000);
  }

  afterContent.addEventListener("click", clickHandler);
}

window.addEventListener("DOMContentLoaded", () => {
  handleEmailClick("contacts__item--email", "example@domain.com");
  handleEmailClick("contacts__item--phone", "+40 123 456 789");
  handleEmailClick("contacts__item--facebook", "bellatrix bisantin art");
  handleEmailClick("contacts__item--address", "Bucuresti, bd lui Ivan Turbinca 12/3");
});