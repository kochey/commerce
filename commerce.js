fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(products => {
    console.log(products);
  });