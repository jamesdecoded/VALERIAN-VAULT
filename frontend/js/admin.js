// Admin Dashboard Logic

// Check authentication
checkAdminAuth();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadOrders();
    loadRequests();
    loadSlides();
    updateDashboardStats();
    initNavigation();
    initProductModal();
    initSlideModal();
    initLogout();
    initCustomConfirm();
});

// Custom Confirm/Alert System
function initCustomConfirm() {
    // Create modal HTML if it doesn't exist
    if (!document.getElementById('customConfirmOverlay')) {
        const modalHTML = `
            <div id="customConfirmOverlay" class="custom-confirm-overlay">
                <div class="custom-confirm-modal">
                    <div class="custom-confirm-header">
                        <div id="customConfirmIcon" class="custom-confirm-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path id="customConfirmIconPath" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <h3 id="customConfirmTitle" class="custom-confirm-title">Confirm Action</h3>
                    </div>
                    <p id="customConfirmMessage" class="custom-confirm-message"></p>
                    <div class="custom-confirm-actions">
                        <button id="customConfirmCancel" class="custom-confirm-btn cancel">Cancel</button>
                        <button id="customConfirmOk" class="custom-confirm-btn confirm">Confirm</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

function customConfirm(message, title = 'Confirm Action', isDanger = false) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('customConfirmOverlay');
        const titleEl = document.getElementById('customConfirmTitle');
        const messageEl = document.getElementById('customConfirmMessage');
        const cancelBtn = document.getElementById('customConfirmCancel');
        const okBtn = document.getElementById('customConfirmOk');
        const icon = document.getElementById('customConfirmIcon');
        const iconPath = document.getElementById('customConfirmIconPath');

        titleEl.textContent = title;
        messageEl.textContent = message;

        // Set icon and style based on type
        if (isDanger) {
            icon.className = 'custom-confirm-icon warning';
            okBtn.className = 'custom-confirm-btn confirm danger';
            okBtn.textContent = 'Delete';
            iconPath.setAttribute('d', 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z');
        } else {
            icon.className = 'custom-confirm-icon info';
            okBtn.className = 'custom-confirm-btn confirm';
            okBtn.textContent = 'Confirm';
            iconPath.setAttribute('d', 'M22 11.08V12a10 10 0 1 1-5.93-9.14');
        }

        overlay.classList.add('active');

        const handleCancel = () => {
            overlay.classList.remove('active');
            cancelBtn.removeEventListener('click', handleCancel);
            okBtn.removeEventListener('click', handleOk);
            resolve(false);
        };

        const handleOk = () => {
            overlay.classList.remove('active');
            cancelBtn.removeEventListener('click', handleCancel);
            okBtn.removeEventListener('click', handleOk);
            resolve(true);
        };

        cancelBtn.addEventListener('click', handleCancel);
        okBtn.addEventListener('click', handleOk);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                handleCancel();
            }
        });
    });
}

function customAlert(message, title = 'Information') {
    return new Promise((resolve) => {
        const overlay = document.getElementById('customConfirmOverlay');
        const titleEl = document.getElementById('customConfirmTitle');
        const messageEl = document.getElementById('customConfirmMessage');
        const cancelBtn = document.getElementById('customConfirmCancel');
        const okBtn = document.getElementById('customConfirmOk');
        const icon = document.getElementById('customConfirmIcon');
        const iconPath = document.getElementById('customConfirmIconPath');

        titleEl.textContent = title;
        messageEl.textContent = message;

        icon.className = 'custom-confirm-icon info';
        okBtn.className = 'custom-confirm-btn confirm';
        okBtn.textContent = 'OK';
        cancelBtn.style.display = 'none';
        iconPath.setAttribute('d', 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z');

        overlay.classList.add('active');

        const handleOk = () => {
            overlay.classList.remove('active');
            cancelBtn.style.display = '';
            okBtn.removeEventListener('click', handleOk);
            resolve(true);
        };

        okBtn.addEventListener('click', handleOk);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                handleOk();
            }
        });
    });
}

// Check Admin Authentication
function checkAdminAuth() {
    const session = localStorage.getItem('valerianSession');
    
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    
    const sessionData = JSON.parse(session);
    
    if (sessionData.type !== 'admin') {
        window.location.href = 'login.html';
    }
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav-link');
    const sections = document.querySelectorAll('.admin-section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetSection = link.dataset.section;

            // Update nav links
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update sections
            sections.forEach(section => {
                if (section.id === `${targetSection}Section`) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });
}

// Logout
function initLogout() {
    document.getElementById('adminLogout').addEventListener('click', async () => {
        const confirmed = await customConfirm(
            'Are you sure you want to logout? You will be redirected to the login page.',
            'Logout Confirmation'
        );
        if (confirmed) {
            localStorage.removeItem('valerianSession');
            sessionStorage.removeItem('valerianSession');
            window.location.href = 'login.html';
        }
    });
}

// Load Products
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('adminProducts')) || getDefaultProducts();
    localStorage.setItem('adminProducts', JSON.stringify(products));
    renderProductsTable(products);
}

// Get Default Products
function getDefaultProducts() {
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

// Render Products Table
function renderProductsTable(products) {
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No products yet</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-image-cell"></td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>${product.category}</td>
            <td>KES ${product.price.toLocaleString()}</td>
            <td>
                ${product.trending ? '<span class="trending-badge">Trending</span>' : '-'}
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" onclick="editProduct(${product.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Product Modal
function initProductModal() {
    document.getElementById('addProductBtn').addEventListener('click', openProductModal);
    document.getElementById('productModalClose').addEventListener('click', closeProductModal);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('overlay');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');

    form.reset();

    if (productId) {
        // Edit mode
        const products = JSON.parse(localStorage.getItem('adminProducts')) || [];
        const product = products.find(p => p.id === productId);

        if (product) {
            title.textContent = 'Edit Product';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productBrand').value = product.brand;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productImage').value = product.image;
            document.getElementById('productSizes').value = product.sizes.join(', ');
            document.getElementById('productTrending').checked = product.trending;
        }
    } else {
        // Add mode
        title.textContent = 'Add New Product';
        document.getElementById('productId').value = '';
    }

    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function handleProductSubmit(e) {
    e.preventDefault();

    const products = JSON.parse(localStorage.getItem('adminProducts')) || [];
    const productId = document.getElementById('productId').value;

    const productData = {
        id: productId ? parseInt(productId) : Date.now(),
        name: document.getElementById('productName').value,
        brand: document.getElementById('productBrand').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        image: document.getElementById('productImage').value,
        sizes: document.getElementById('productSizes').value.split(',').map(s => s.trim()),
        trending: document.getElementById('productTrending').checked
    };

    if (productId) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = productData;
            showToast('Product updated successfully!');
        }
    } else {
        // Add new product
        products.push(productData);
        showToast('Product added successfully!');
    }

    localStorage.setItem('adminProducts', JSON.stringify(products));
    renderProductsTable(products);
    updateDashboardStats();
    closeProductModal();
}

function editProduct(productId) {
    openProductModal(productId);
}

async function deleteProduct(productId) {
    const confirmed = await customConfirm(
        'This product will be permanently deleted. This action cannot be undone.',
        'Delete Product',
        true
    );
    if (!confirmed) return;

    const products = JSON.parse(localStorage.getItem('adminProducts')) || [];
    const filtered = products.filter(p => p.id !== productId);

    localStorage.setItem('adminProducts', JSON.stringify(filtered));
    renderProductsTable(filtered);
    updateDashboardStats();
    showToast('Product deleted successfully!');
}

// Load Orders
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    renderOrdersTable(orders);
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No orders yet</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>${order.items.length} items</td>
            <td>KES ${order.total.toLocaleString()}</td>
            <td>${order.paymentMethod}</td>
            <td>
                <button class="action-btn" onclick="viewOrder('${order.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

async function viewOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        const message = `Order ID: #${order.id}\n\nItems: ${order.items.length} product(s)\nTotal: KES ${order.total.toLocaleString()}\nPayment Method: ${order.paymentMethod}\nDate: ${new Date(order.createdAt).toLocaleString()}`;
        await customAlert(message, 'Order Details');
    }
}

// Load Requests
function loadRequests() {
    const requests = JSON.parse(localStorage.getItem('requests')) || [];
    renderRequestsGrid(requests);
}

function renderRequestsGrid(requests) {
    const grid = document.getElementById('requestsGrid');
    
    if (requests.length === 0) {
        grid.innerHTML = '<p class="empty-state">No item requests yet</p>';
        return;
    }

    grid.innerHTML = requests.map(request => `
        <div class="request-card">
            <div class="request-header">
                <h4>${request.productName || 'Item Request'}</h4>
                <span class="request-date">${new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="request-details">
                ${request.brand ? `<div class="request-detail"><strong>Brand:</strong> ${request.brand}</div>` : ''}
                ${request.size ? `<div class="request-detail"><strong>Size:</strong> ${request.size}</div>` : ''}
                ${request.budget ? `<div class="request-detail"><strong>Budget:</strong> KES ${parseInt(request.budget).toLocaleString()}</div>` : ''}
                <div class="request-detail"><strong>Contact:</strong> ${request.whatsapp}</div>
                ${request.productLink ? `<div class="request-detail"><strong>Link:</strong> <a href="${request.productLink}" target="_blank" style="color: var(--gold);">View</a></div>` : ''}
            </div>
        </div>
    `).join('');
}

// Update Dashboard Stats
function updateDashboardStats() {
    const products = JSON.parse(localStorage.getItem('adminProducts')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const requests = JSON.parse(localStorage.getItem('requests')) || [];

    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalRequests').textContent = requests.length;

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('totalRevenue').textContent = `KES ${totalRevenue.toLocaleString()}`;

    // Recent orders
    const recentOrders = orders.slice(-5).reverse();
    const recentOrdersEl = document.getElementById('recentOrders');
    
    if (recentOrders.length === 0) {
        recentOrdersEl.innerHTML = '<p class="empty-state">No orders yet</p>';
    } else {
        recentOrdersEl.innerHTML = recentOrders.map(order => `
            <div class="recent-item">
                <strong>Order #${order.id}</strong><br>
                <small>${order.items.length} items • KES ${order.total.toLocaleString()}</small>
            </div>
        `).join('');
    }

    // Recent requests
    const recentRequests = requests.slice(-5).reverse();
    const recentRequestsEl = document.getElementById('recentRequests');
    
    if (recentRequests.length === 0) {
        recentRequestsEl.innerHTML = '<p class="empty-state">No requests yet</p>';
    } else {
        recentRequestsEl.innerHTML = recentRequests.map(request => `
            <div class="recent-item">
                <strong>${request.productName || 'Item Request'}</strong><br>
                <small>${request.brand || 'No brand'} • ${request.whatsapp}</small>
            </div>
        `).join('');
    }
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Make functions global
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewOrder = viewOrder;
window.closeProductModal = closeProductModal;
window.editSlide = editSlide;
window.deleteSlide = deleteSlide;
window.closeSlideModal = closeSlideModal;

// Slide Management
function initSlideModal() {
    document.getElementById('addSlideBtn').addEventListener('click', () => openSlideModal());
    document.getElementById('slideModalClose').addEventListener('click', closeSlideModal);
    document.getElementById('slideForm').addEventListener('submit', handleSlideSubmit);
}

function loadSlides() {
    const slides = JSON.parse(localStorage.getItem('heroSlides')) || getDefaultSlides();
    localStorage.setItem('heroSlides', JSON.stringify(slides));
    renderSlidesGrid(slides);
}

function getDefaultSlides() {
    return [
        {
            id: 1,
            title: 'GLOBAL FASHION.<br>NAIROBI ENERGY.',
            subtitle: 'Luxury streetwear, sneakers, and curated fashion delivered across Kenya.',
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
            primaryBtn: 'Explore Collection',
            primaryLink: '#explore',
            secondaryBtn: 'Request an Item',
            secondaryLink: '#request'
        },
        {
            id: 2,
            title: 'NEW SEASON<br>ARRIVALS',
            subtitle: 'Discover the latest luxury fashion and streetwear collections.',
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80',
            primaryBtn: 'Shop Now',
            primaryLink: '#explore',
            secondaryBtn: 'View Trending',
            secondaryLink: '#shop'
        },
        {
            id: 3,
            title: 'EXCLUSIVE<br>LUXURY DROPS',
            subtitle: 'Limited edition pieces from the world\'s top fashion houses.',
            image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
            primaryBtn: 'Discover More',
            primaryLink: '#explore',
            secondaryBtn: 'Request Item',
            secondaryLink: '#request'
        }
    ];
}

function renderSlidesGrid(slides) {
    const grid = document.getElementById('slidesGrid');
    
    if (slides.length === 0) {
        grid.innerHTML = '<p class="empty-state">No slides yet. Add your first slide!</p>';
        return;
    }

    grid.innerHTML = slides.map(slide => `
        <div class="slide-card">
            <div class="slide-preview" style="background-image: url('${slide.image}')">
                <div class="slide-preview-content">
                    <h4>${slide.title.replace('<br>', ' ')}</h4>
                    <p>${slide.subtitle}</p>
                </div>
            </div>
            <div class="slide-card-actions">
                <button class="action-btn" onclick="editSlide(${slide.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                </button>
                <button class="action-btn delete" onclick="deleteSlide(${slide.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openSlideModal(slideId = null) {
    const modal = document.getElementById('slideModal');
    const overlay = document.getElementById('overlay');
    const form = document.getElementById('slideForm');
    const title = document.getElementById('slideModalTitle');

    form.reset();

    if (slideId) {
        const slides = JSON.parse(localStorage.getItem('heroSlides')) || [];
        const slide = slides.find(s => s.id === slideId);

        if (slide) {
            title.textContent = 'Edit Slide';
            document.getElementById('slideId').value = slide.id;
            document.getElementById('slideTitle').value = slide.title.replace('<br>', '\n');
            document.getElementById('slideSubtitle').value = slide.subtitle;
            document.getElementById('slideImage').value = slide.image;
            document.getElementById('slidePrimaryBtn').value = slide.primaryBtn || '';
            document.getElementById('slidePrimaryLink').value = slide.primaryLink || '';
            document.getElementById('slideSecondaryBtn').value = slide.secondaryBtn || '';
            document.getElementById('slideSecondaryLink').value = slide.secondaryLink || '';
        }
    } else {
        title.textContent = 'Add New Slide';
        document.getElementById('slideId').value = '';
    }

    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeSlideModal() {
    document.getElementById('slideModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function handleSlideSubmit(e) {
    e.preventDefault();

    const slides = JSON.parse(localStorage.getItem('heroSlides')) || [];
    const slideId = document.getElementById('slideId').value;

    const slideData = {
        id: slideId ? parseInt(slideId) : Date.now(),
        title: document.getElementById('slideTitle').value.replace('\n', '<br>'),
        subtitle: document.getElementById('slideSubtitle').value,
        image: document.getElementById('slideImage').value,
        primaryBtn: document.getElementById('slidePrimaryBtn').value,
        primaryLink: document.getElementById('slidePrimaryLink').value,
        secondaryBtn: document.getElementById('slideSecondaryBtn').value,
        secondaryLink: document.getElementById('slideSecondaryLink').value
    };

    if (slideId) {
        const index = slides.findIndex(s => s.id === parseInt(slideId));
        if (index !== -1) {
            slides[index] = slideData;
            showToast('Slide updated successfully!');
        }
    } else {
        slides.push(slideData);
        showToast('Slide added successfully!');
    }

    localStorage.setItem('heroSlides', JSON.stringify(slides));
    renderSlidesGrid(slides);
    closeSlideModal();
}

function editSlide(slideId) {
    openSlideModal(slideId);
}

async function deleteSlide(slideId) {
    const confirmed = await customConfirm(
        'This slide will be permanently removed from the homepage. This action cannot be undone.',
        'Delete Slide',
        true
    );
    if (!confirmed) return;

    const slides = JSON.parse(localStorage.getItem('heroSlides')) || [];
    const filtered = slides.filter(s => s.id !== slideId);

    localStorage.setItem('heroSlides', JSON.stringify(filtered));
    renderSlidesGrid(filtered);
    showToast('Slide deleted successfully!');
}
