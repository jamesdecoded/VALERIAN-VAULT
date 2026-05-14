// Product Data - Load from admin or use defaults
function getProducts() {
    const adminProducts = localStorage.getItem('adminProducts');
    if (adminProducts) {
        return JSON.parse(adminProducts);
    }
    return [
        { id: 1, name: 'Air Jordan 1 Retro High', brand: 'Nike', price: 28500, category: 'sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'], trending: true },
        { id: 2, name: 'Dunk Low Panda', brand: 'Nike', price: 22000, category: 'sneakers', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800', sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'], trending: true },
        { id: 3, name: 'Yeezy Boost 350', brand: 'Adidas', price: 35000, category: 'sneakers', image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800', sizes: ['UK 8', 'UK 9', 'UK 10', 'UK 11'], trending: false },
        { id: 4, name: 'Lady Dior Bag', brand: 'Dior', price: 450000, category: 'bags', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800', sizes: ['One Size'], trending: true },
        { id: 5, name: 'Neverfull MM', brand: 'Louis Vuitton', price: 380000, category: 'bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', sizes: ['One Size'], trending: false },
        { id: 6, name: 'Supreme Box Logo Hoodie', brand: 'Supreme', price: 45000, category: 'hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', sizes: ['S', 'M', 'L', 'XL'], trending: true },
        { id: 7, name: 'Essentials Hoodie', brand: 'Fear of God', price: 32000, category: 'hoodies', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800', sizes: ['S', 'M', 'L', 'XL'], trending: false },
        { id: 8, name: 'Submariner', brand: 'Rolex', price: 1200000, category: 'watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', sizes: ['One Size'], trending: true },
        { id: 9, name: 'Royal Oak', brand: 'Audemars Piguet', price: 2500000, category: 'watches', image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800', sizes: ['One Size'], trending: false },
        { id: 10, name: 'Leather Jacket', brand: 'Saint Laurent', price: 185000, category: 'streetwear', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', sizes: ['S', 'M', 'L'], trending: true },
        { id: 11, name: 'Cargo Pants', brand: 'Off-White', price: 55000, category: 'streetwear', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800', sizes: ['S', 'M', 'L', 'XL'], trending: false },
        { id: 12, name: 'Designer Sunglasses', brand: 'Gucci', price: 42000, category: 'accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', sizes: ['One Size'], trending: true },
        { id: 13, name: 'Air Force 1', brand: 'Nike', price: 18500, category: 'sneakers', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'], trending: false },
        { id: 14, name: 'Crossbody Bag', brand: 'Prada', price: 280000, category: 'bags', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800', sizes: ['One Size'], trending: false },
        { id: 15, name: 'Graphic Tee', brand: 'Balenciaga', price: 38000, category: 'streetwear', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', sizes: ['S', 'M', 'L', 'XL'], trending: false },
    ];
}

const products = getProducts();

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';
let activeFilters = {
    categories: ['all'],
    priceRanges: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderTrendingProducts();
    updateCartUI();
    initEventListeners();
    initScrollEffects();
    initHeroSlideshow();
});

// Event Listeners
function initEventListeners() {
    // Navigation
    document.getElementById('searchBtn').addEventListener('click', toggleSearch);
    document.getElementById('searchClose').addEventListener('click', toggleSearch);
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('cartClose').addEventListener('click', toggleCart);
    document.getElementById('overlay').addEventListener('click', closeAll);
    
    // Profile button - redirect to login
    document.getElementById('profileBtn').addEventListener('click', () => {
        window.location.href = 'login.html';
    });
    
    // Filter Toggle
    document.getElementById('filterToggle').addEventListener('click', toggleFilters);
    document.getElementById('filterClose').addEventListener('click', toggleFilters);
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    
    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Category Pills
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.category;
            renderProducts();
        });
    });
    
    // Forms
    document.getElementById('requestForm').addEventListener('submit', handleRequestSubmit);
    document.getElementById('newsletterForm').addEventListener('submit', handleNewsletterSubmit);
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
    
    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
    
    // Quick View Close
    document.getElementById('quickViewClose').addEventListener('click', closeQuickView);
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Scroll Effects
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button
        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        lastScroll = currentScroll;
    });
    
    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Render Products
function renderProducts() {
    const grid = document.getElementById('productGrid');
    let filtered = currentFilter === 'all' 
        ? products 
        : products.filter(p => p.category === currentFilter);
    
    // Apply price range filters if any
    if (activeFilters.priceRanges.length > 0) {
        filtered = filtered.filter(product => {
            return activeFilters.priceRanges.some(range => {
                if (range === '0-50000') return product.price < 50000;
                if (range === '50000-100000') return product.price >= 50000 && product.price <= 100000;
                if (range === '100000-500000') return product.price >= 100000 && product.price <= 500000;
                if (range === '500000+') return product.price > 500000;
                return true;
            });
        });
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem 0; color: rgba(255,255,255,0.5);">No products found. Try adjusting your filters.</div>';
        return;
    }
    
    grid.innerHTML = filtered.map((product, index) => `
        <div class="product-card" data-id="${product.id}" style="animation-delay: ${index * 0.05}s" onclick="openQuickView(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-footer">
                    <div class="product-price">KES ${product.price.toLocaleString()}</div>
                    <div class="product-actions">
                        <button class="icon-btn" onclick="event.stopPropagation(); addToCart(${product.id})" title="Add to Cart">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Trending Products
function renderTrendingProducts() {
    const grid = document.getElementById('trendingGrid');
    const trending = products.filter(p => p.trending);
    
    grid.innerHTML = trending.map((product, index) => `
        <div class="product-card" data-id="${product.id}" style="animation-delay: ${index * 0.05}s" onclick="openQuickView(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-footer">
                    <div class="product-price">KES ${product.price.toLocaleString()}</div>
                    <div class="product-actions">
                        <button class="icon-btn" onclick="event.stopPropagation(); addToCart(${product.id})" title="Add to Cart">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Quick View
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    
    content.innerHTML = `
        <div>
            <img src="${product.image}" alt="${product.name}" class="quick-view-image">
        </div>
        <div class="quick-view-info">
            <div class="quick-view-brand">${product.brand}</div>
            <h2>${product.name}</h2>
            <div class="quick-view-price">KES ${product.price.toLocaleString()}</div>
            <p class="quick-view-description">
                Premium ${product.category} from ${product.brand}. Authentic guaranteed. 
                Fast delivery across Kenya.
            </p>
            <div class="size-selector">
                <label>Select Size</label>
                <div class="size-options">
                    ${product.sizes.map(size => `
                        <div class="size-option" onclick="selectSize(this)">${size}</div>
                    `).join('')}
                </div>
            </div>
            <button class="btn btn-primary btn-large" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeQuickView() {
    document.getElementById('quickViewModal').classList.remove('active');
}

function selectSize(element) {
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showToast('Added to cart!', 'success');
    closeQuickView();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `KES ${totalPrice.toLocaleString()}`;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-brand">${item.brand}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="cart-item-qty">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div>
                    <div class="cart-item-price">KES ${(item.price * item.quantity).toLocaleString()}</div>
                </div>
            </div>
        `).join('');
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Search
function toggleSearch() {
    const modal = document.getElementById('searchModal');
    const overlay = document.getElementById('overlay');
    modal.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (modal.classList.contains('active')) {
        document.getElementById('searchInput').focus();
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const results = document.getElementById('searchResults');
    
    if (query.length < 2) {
        results.innerHTML = `
            <div class="search-section">
                <h4>Trending Searches</h4>
                <div class="search-tags">
                    <span class="search-tag" onclick="searchByTag('Jordan 1')">Jordan 1</span>
                    <span class="search-tag" onclick="searchByTag('Dior')">Dior Bags</span>
                    <span class="search-tag" onclick="searchByTag('Supreme')">Supreme Hoodies</span>
                    <span class="search-tag" onclick="searchByTag('Rolex')">Rolex</span>
                </div>
            </div>
        `;
        return;
    }
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    
    if (filtered.length === 0) {
        results.innerHTML = '<div class="search-section"><p style="color: rgba(255,255,255,0.6); padding: 2rem;">No results found. Try our Request Item feature!</p></div>';
        return;
    }
    
    results.innerHTML = `
        <div class="search-section">
            <h4>Products (${filtered.length})</h4>
            <div class="product-grid">
                ${filtered.slice(0, 6).map(product => `
                    <div class="product-card" onclick="openQuickView(${product.id}); toggleSearch();">
                        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                        <div class="product-info">
                            <div class="product-brand">${product.brand}</div>
                            <div class="product-name">${product.name}</div>
                            <div class="product-price">KES ${product.price.toLocaleString()}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function searchByTag(query) {
    document.getElementById('searchInput').value = query;
    document.getElementById('searchInput').dispatchEvent(new Event('input'));
}

// Form Validation Helper Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateWhatsApp(phone) {
    const phoneRegex = /^(\+254|0)[0-9]{9}$/;
    return phoneRegex.test(phone);
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Forms
async function handleRequestSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validation
    if (!validateRequired(data.productName)) {
        showToast('Please enter a product name or description', 'error');
        return;
    }
    
    if (!validateRequired(data.name)) {
        showToast('Please enter your name', 'error');
        return;
    }
    
    if (!validateRequired(data.whatsapp)) {
        showToast('Please enter your WhatsApp number', 'error');
        return;
    }
    
    if (!validateWhatsApp(data.whatsapp)) {
        showToast('Please enter a valid WhatsApp number (e.g., +254712345678)', 'error');
        return;
    }
    
    if (data.productLink && !validateUrl(data.productLink)) {
        showToast('Please enter a valid product link', 'error');
        return;
    }
    
    if (data.budget && isNaN(parseInt(data.budget))) {
        showToast('Please enter a valid budget amount', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            // Also save to localStorage for admin
            const requests = JSON.parse(localStorage.getItem('requests')) || [];
            const request = await response.json();
            requests.push(request);
            localStorage.setItem('requests', JSON.stringify(requests));
            
            showToast('Request submitted! We\'ll contact you on WhatsApp soon.', 'success');
            e.target.reset();
            document.getElementById('fileName').textContent = 'No file chosen';
        } else {
            showToast('Error submitting request. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Request submission error:', error);
        showToast('Error submitting request. Please try again.', 'error');
    }
}

async function handleNewsletterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validation
    if (!validateRequired(data.email)) {
        showToast('Please enter your email address', 'error');
        return;
    }
    
    if (!validateEmail(data.email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast('Subscribed successfully!', 'success');
            e.target.reset();
        } else {
            showToast('Error subscribing. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showToast('Error subscribing. Please try again.', 'error');
    }
}

function handleImageUpload(e) {
    const fileName = e.target.files[0]?.name || 'No file chosen';
    document.getElementById('fileName').textContent = fileName;
}

async function handleCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    
    const orderData = {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentMethod: 'M-Pesa'
    };
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            // Also save to localStorage for admin
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            const order = await response.json();
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            showToast('Order placed! Check WhatsApp for M-Pesa payment details.', 'success');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            toggleCart();
        } else {
            showToast('Error placing order. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Error placing order. Please try again.', 'error');
    }
}

// Utilities
function closeAll() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('searchModal').classList.remove('active');
    document.getElementById('filterSidebar')?.classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Filter Functions
function toggleFilters() {
    const sidebar = document.getElementById('filterSidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function applyFilters() {
    const categoryCheckboxes = document.querySelectorAll('[data-filter-type="category"]:checked');
    const priceCheckboxes = document.querySelectorAll('[data-filter-type="price"]:checked');
    
    activeFilters.categories = Array.from(categoryCheckboxes).map(cb => cb.value);
    activeFilters.priceRanges = Array.from(priceCheckboxes).map(cb => cb.value);
    
    // Handle category filtering
    if (activeFilters.categories.includes('all') || activeFilters.categories.length === 0) {
        currentFilter = 'all';
    } else if (activeFilters.categories.length === 1) {
        currentFilter = activeFilters.categories[0];
    } else {
        // Multiple categories selected - use 'all' and filter in renderProducts
        currentFilter = 'all';
    }
    
    // Update category pills to reflect filter
    document.querySelectorAll('.category-pill').forEach(pill => {
        if (pill.dataset.category === currentFilter) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });
    
    renderProducts();
    toggleFilters();
    
    const filterCount = activeFilters.priceRanges.length + (currentFilter === 'all' ? 0 : 1);
    if (filterCount > 0) {
        showToast(`${filterCount} filter(s) applied`, 'success');
    } else {
        showToast('Filters cleared');
    }
}

function showToast(message, type = 'default') {
    const toast = document.getElementById('toast');
    
    // Remove existing classes
    toast.className = 'toast';
    
    // Add type class
    if (type === 'success') {
        toast.classList.add('toast-success');
    } else if (type === 'error') {
        toast.classList.add('toast-error');
    } else if (type === 'warning') {
        toast.classList.add('toast-warning');
    }
    
    // Get icon based on type
    let icon = '';
    if (type === 'success') {
        icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
        icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else if (type === 'warning') {
        icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    } else {
        icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="shatterToast()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    toast.classList.add('active');
    
    setTimeout(() => {
        if (toast.classList.contains('active')) {
            shatterToast();
        }
    }, 4000);
}

function shatterToast() {
    const toast = document.getElementById('toast');
    if (!toast.classList.contains('active')) return;
    
    // Get toast position and size
    const rect = toast.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create glass shards
    const shardCount = 12;
    for (let i = 0; i < shardCount; i++) {
        const shard = document.createElement('div');
        shard.className = 'glass-shard';
        
        // Random shard size
        const size = 20 + Math.random() * 30;
        shard.style.width = size + 'px';
        shard.style.height = size + 'px';
        
        // Position at toast center
        shard.style.left = centerX + 'px';
        shard.style.top = centerY + 'px';
        
        // Random trajectory
        const angle = (i / shardCount) * Math.PI * 2;
        const distance = 100 + Math.random() * 150;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rotation = Math.random() * 720 - 360;
        
        shard.style.setProperty('--tx', tx + 'px');
        shard.style.setProperty('--ty', ty + 'px');
        shard.style.setProperty('--r', rotation + 'deg');
        
        document.body.appendChild(shard);
        
        // Remove shard after animation
        setTimeout(() => {
            shard.remove();
        }, 800);
    }
    
    // Add shattering class to toast
    toast.classList.add('shattering');
    
    // Remove toast after animation
    setTimeout(() => {
        toast.classList.remove('active', 'shattering');
        toast.className = 'toast';
    }, 600);
}

// Make function global
window.shatterToast = shatterToast;

// Make functions global
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.openQuickView = openQuickView;
window.selectSize = selectSize;
window.searchByTag = searchByTag;

// Hero Slideshow
let currentSlide = 0;
let slideInterval;

function initHeroSlideshow() {
    loadHeroSlides();
    attachSlideshowListeners();
    startSlideshow();
}

function attachSlideshowListeners() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    const hero = document.querySelector('.hero');
    
    if (!slides.length) return;
    
    // Make slides clickable
    slides.forEach(slide => {
        slide.addEventListener('click', (e) => {
            if (e.target.closest('.hero-actions') || e.target.closest('.hero-nav') || e.target.closest('.hero-indicator')) return;
            document.querySelector('#explore').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopSlideshow();
        previousSlide();
        startSlideshow();
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopSlideshow();
        nextSlide();
        startSlideshow();
    });
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            e.stopPropagation();
            stopSlideshow();
            goToSlide(index);
            startSlideshow();
        });
    });
    
    hero.addEventListener('mouseenter', stopSlideshow);
    hero.addEventListener('mouseleave', startSlideshow);
}

function loadHeroSlides() {
    const adminSlides = localStorage.getItem('heroSlides');
    if (!adminSlides) return;
    
    const slides = JSON.parse(adminSlides);
    const heroSlideshow = document.querySelector('.hero-slideshow');
    const heroIndicators = document.querySelector('.hero-indicators');
    
    if (!heroSlideshow || !slides.length) return;
    
    // Update slideshow HTML
    heroSlideshow.innerHTML = slides.map((slide, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : ''}" data-slide="${index}">
            <div class="hero-bg" style="background-image: url('${slide.image}')"></div>
            <div class="hero-content">
                <h1 class="hero-title">${slide.title}</h1>
                <p class="hero-subtitle">${slide.subtitle}</p>
                <div class="hero-actions">
                    ${slide.primaryBtn ? `<a href="${slide.primaryLink}" class="btn btn-primary">${slide.primaryBtn}</a>` : ''}
                    ${slide.secondaryBtn ? `<a href="${slide.secondaryLink}" class="btn btn-secondary">${slide.secondaryBtn}</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Update indicators
    heroIndicators.innerHTML = slides.map((_, index) => `
        <button class="hero-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Slide ${index + 1}"></button>
    `).join('');
    
    // Reset current slide
    currentSlide = 0;
    
    // Re-attach all listeners
    attachSlideshowListeners();
}

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

function nextSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlideshow();
}

function previousSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlideshow();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlideshow();
}

function updateSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}
