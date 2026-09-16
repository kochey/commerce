const productsEl = document.querySelector("#products");
const cartEl = document.querySelector("#cart");
const categoryLinks = document.querySelectorAll("#categories a");

let products = [];
// const cart = [];
const cart = JSON.parse(localStorage.getItem("cart")) || [];
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

const money = n => `$${n.toFixed(2)}`;

function productCard(p) {
  const card = document.createElement("article");
  card.innerHTML = `
    <img src="${p.image}" alt="${p.title}" width="200" />
    <h3>${p.title}</h3>
    <p>${p.category}</p>
    <p>${money(p.price)}</p>
    <p>Rating: ${p.rating.rate} / 5</p>
    <button>Add to Cart</button>
  `;
  card.querySelector("button").addEventListener("click", () => addToCart(p));
  return card;
}

function renderProducts(list) {
  productsEl.innerHTML = "<h2>Products</h2>";

  if (!list.length) {
    productsEl.insertAdjacentHTML("beforeend", "<p>No products found.</p>");
    return;
  }

  list.forEach(p => productsEl.appendChild(productCard(p)));
}

function addToCart(p) {
  cart.push(p);
  saveCart();
  renderCart();
}

function renderCart() {
  const total = cart.reduce((sum, p) => sum + p.price, 0);

  const items = cart.map((p, i) => `
    <li>
      ${p.title} — ${money(p.price)}
      <button class="remove" data-index="${i}">Remove</button>
    </li>
  `).join("");

  cartEl.innerHTML = `
    <h2>Your Cart</h2>
    ${cart.length
      ? `<ul class="cart-items">${items}</ul><p>Total: ${money(total)}</p>`
      : "<p>Your cart is currently empty.</p>"}
    <button>Checkout</button>
  `;

  // Attach a click listener to every Remove button
  cartEl.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      cart.splice(index, 1);  
      saveCart();              
      renderCart();            
    });
  });
}
categoryLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const name = link.textContent.trim().toLowerCase();
    const list = name === "all" ? products : products.filter(p => p.category === name);
    renderProducts(list);
  });
});

fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts(products);
    renderCart();
  })
  .catch(() => {
    productsEl.innerHTML = "<h2>Products</h2><p>Could not load products.</p>";
  });  