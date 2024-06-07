const imagesDOM = [
  document.querySelector(".home__image--1"),
  document.querySelector(".home__image--2"),
  document.querySelector(".home__image--3")
]
fetch("/productsGallery")
  .then(response => {
    if(!response.ok) throw new Error("failed to reach firebase");
    return response.json();
  })
  .then(products => {
    const prods = products;
    imagesDOM.forEach((image, index) => {
      if (prods.length > 0) {
        let randIndex = Math.floor(Math.random() * prods.length);
        image.src = prods[randIndex].previewImageDownloadURL;
        prods.splice(randIndex, 1);
      }
    });
  })
  .catch(err => {
    console.error(err.message);
  });