const defaultProducts = [
  { id: 1, name: "Cozy Bear Onesie", price: 2500.00, image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4", category: "Night wear", rating: 4.8, sizes: ["0-3 months", "3-6 months"] },
  { id: 2, name: "Pastel Dream Dress", price: 3400.00, image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8", category: "For Girls", rating: 4.6, sizes: ["3-6 months", "6-9 months"] },
  { id: 3, name: "Bunny Ear Beanie", price: 1250.00, image: "https://images.unsplash.com/photo-1544400599-2a912bbbc24c", category: "Accessories", rating: 4.9, sizes: ["0-3 months"] },
  { id: 4, name: "Soft Cloud Booties", price: 1800.00, image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42", category: "Essentials", rating: 4.7, sizes: ["6-9 months", "9-12 months"] },
  { id: 5, name: "Gentle Knit Blanket", price: 4500.00, image: "https://images.unsplash.com/photo-1582239423985-e6593a5eb40c", category: "Essentials", rating: 4.5, sizes: ["12-18 months"] },
  { id: 6, name: "Dinosaur Romper", price: 2200.00, image: "https://images.unsplash.com/photo-1503919005314-16e788bc26ce", category: "For Boys", rating: 4.3, sizes: ["6-9 months", "9-12 months"] },
  { id: 7, name: "Little Sailor Suit", price: 2990.00, image: "https://images.unsplash.com/photo-16196ff315cf3-605a92a54b38", category: "For Boys", rating: 4.9, sizes: ["12-18 months", "18-24 months"] },
  { id: 8, name: "Starry Night Swaddle", price: 1500.00, image: "https://images.unsplash.com/photo-1555529733-0e67056058ab", category: "Night wear", rating: 4.8, sizes: ["0-3 months"] }
];

let products = JSON.parse(localStorage.getItem('mamasBabyProducts')) || [];
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

  // Admin Check for nav link visibility
  const isAdmin = localStorage.getItem('mamasBabyAdmin') === 'true';
  const adminNavLinks = document.querySelectorAll('.admin-nav-link');
  adminNavLinks.forEach(link => {
    if (isAdmin) {
      link.classList.remove('hidden');
    }
  });
});
