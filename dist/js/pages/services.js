

const sendRequest = (value) => {
  const data = {
    name: "",
    email: "",
    number: "",
    message: "",
    category: "service",
    service: value
  };
  const strData = JSON.stringify(data);
  localStorage.setItem("BBA_form-data", strData);
  location.href = "../pages/formular.html";
}
window.addEventListener("DOMContentLoaded", () => {
  DOM_SERVICES = {
    canvas: {
      element: document.getElementById("services--canvas"),
      value: "canvas"
    },
    mural: {
      element: document.getElementById("services--mural"),
      value: "mural"
    },
    interior: {
      element: document.getElementById("services--interior"),
      value: "interior"
    },
    furniture: {
      element: document.getElementById("services--furniture"),
      value: "furniture"
    },
    makeover: {
      element: document.getElementById("services--makeover"),
      value: "makeover"
    },
    tapestry: {
      element: document.getElementById("services--tapestry"),
      value: "tapestry"
    },
    mosaic: {
      element: document.getElementById("services--mosaic"),
      value: "mosaic"
    },
  }
  for(const key in DOM_SERVICES){
    DOM_SERVICES[key].element.addEventListener("click", () => {
      sendRequest(DOM_SERVICES[key].value);
    });
  }
});