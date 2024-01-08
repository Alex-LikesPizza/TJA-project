// const sliders = document.getElementsByClassName("slider");

// Array.from(sliders).forEach(slider => {
//   slider.dataset.offset = 0;
//   console.log(slider.dataset);
//   const buildButton = (direction) => {
//     const button = document.createElement("div");
//     button.textContent = direction == "left"? '<': '>';
//     button.classList.add("slider__button", `slider__button--${direction}`);
//     button.addEventListener("click", () => {
//       let width = +slider.dataset.offset + (100 * (direction == "left"? 1: -1));
//       slider.style.transform = `translateX(${width}%)`;
//       slider.dataset.offset = width;
//       console.log(slider.dataset);
//     });
//     return button;
//   }
//   const buttonToLeft = buildButton("left");
//   const buttonToRight = buildButton("right");

//   slider.append(buttonToLeft, buttonToRight);

// });