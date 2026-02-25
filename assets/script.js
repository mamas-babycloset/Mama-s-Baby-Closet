const defaultProducts = [];

let products = JSON.parse(localStorage.getItem('mamasBabyProducts')) || [];
// Auto-remove the old demo products which had id <= 10
products = products.filter(p => p.id > 10);
if (products.length === 0) {
  products = defaultProducts;
  localStorage.setItem('mamasBabyProducts', JSON.stringify(products));
}

function saveProducts() {
  localStorage.setItem('mamasBabyProducts', JSON.stringify(products));
}

let orders = JSON.parse(localStorage.getItem('mamasBabyOrders')) || [];
function saveOrders() {
  localStorage.setItem('mamasBabyOrders', JSON.stringify(orders));
}

// Initialize Cart in Local Storage
let cart = JSON.parse(localStorage.getItem('mamasBabyCartLKR')) || [];

function saveCart() {
  localStorage.setItem('mamasBabyCartLKR', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showToast(`Added ${product.name} to cart! 🧸`);
  }
}

function updateCartCount() {
  const cartBadge = document.getElementById('cart-badge');
  if (cartBadge) {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalCount;
    cartBadge.classList.toggle('hidden', totalCount === 0);
  }
}

function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    toast.innerHTML = `<span class="text-xl">✨</span> <p class="font-medium text-gray-700 ml-2" id="toast-msg"></p>`;
    document.body.appendChild(toast);
  }
  document.getElementById('toast-msg').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Generate background bubbles for cute effect
function createBubbles() {
  const container = document.body;
  if (!container.hasAttribute('data-bubbles')) {
    container.setAttribute('data-bubbles', 'true');
    for (let i = 0; i < 15; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble animate-float';
      const size = Math.random() * 100 + 50;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}vw`;
      bubble.style.top = `${Math.random() * 200}vh`; // span multiple viewports
      bubble.style.animationDelay = `${Math.random() * 5}s`;
      bubble.style.animationDuration = `${Math.random() * 3 + 5}s`;
      bubble.style.opacity = Math.random() * 0.4 + 0.1;
      container.appendChild(bubble);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  createBubbles();

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
});
