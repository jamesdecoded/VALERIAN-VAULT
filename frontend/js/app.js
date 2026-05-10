const state = {
  products: [],
  brands: [],
  cart: [],
  wishlist: new Set(),
  orders: [],
  currentPage: 'home',
  prevPage: 'home',
  currentUser: null,
  detailProduct: null,
  hGender: 'All',
  hCat: 'all',
  shopGender: 'All',
  shopCatPreset: null,
  shopGenderPreset: null,
  aiOpen: false,
  aiStarted: false,
  slide: 0,
  slideTimer: null,
  shopFilters: {
    genders: [],
    categories: [],
    brands: [],
    minPrice: 0,
    maxPrice: 100000
  }
};

const LS = {
  cart: 'valerian_cart',
  wishlist: 'valerian_wishlist',
  user: 'valerian_user'
};

const money = value => `KSh ${Number(value || 0).toLocaleString()}`;
const byId = id => document.getElementById(id);

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function loadLocalState() {
  try {
    state.cart = JSON.parse(localStorage.getItem(LS.cart) || '[]');
    state.wishlist = new Set(JSON.parse(localStorage.getItem(LS.wishlist) || '[]'));
    const user = JSON.parse(localStorage.getItem(LS.user) || 'null');
    if (user) setUser(user, false);
  } catch {
    state.cart = [];
    state.wishlist = new Set();
  }
}

function saveCart() {
  localStorage.setItem(LS.cart, JSON.stringify(state.cart));
}

function saveWishlist() {
  localStorage.setItem(LS.wishlist, JSON.stringify([...state.wishlist]));
}

function productById(id) {
  return state.products.find(product => product.id === Number(id));
}

async function loadProducts() {
  const data = await api('/api/products');
  state.products = data.products || [];
  state.brands = data.brands || [];
}

function initHero() {
  const dots = byId('sdots');
  if (!dots) return;
  const slides = document.querySelectorAll('.slide');
  dots.innerHTML = Array.from(slides, (_, index) => `<div class="sdot ${index === 0 ? 'on' : ''}" onclick="goSlide(${index})"></div>`).join('');
  clearInterval(state.slideTimer);
  state.slideTimer = setInterval(() => changeSlide(1), 5200);
}

function changeSlide(dir) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.sdot');
  if (!slides.length) return;
  slides[state.slide]?.classList.remove('active');
  dots[state.slide]?.classList.remove('on');
  state.slide = (state.slide + dir + slides.length) % slides.length;
  slides[state.slide].classList.add('active');
  dots[state.slide]?.classList.add('on');
  byId('strack').style.transform = `translateX(-${state.slide * 100}%)`;
  clearInterval(state.slideTimer);
  state.slideTimer = setInterval(() => changeSlide(1), 5200);
}

function goSlide(index) {
  changeSlide(index - state.slide);
}

function initMarquee() {
  const el = byId('mtrack');
  if (!el) return;
  el.innerHTML = [...state.brands, ...state.brands]
    .map(brand => `<span class="mitem" onclick="gotoShopBrand('${brand}')">${brand}</span><span class="msep">.</span>`)
    .join('');
}

function showPage(page) {
  state.prevPage = state.currentPage;
  window.prevPage = state.prevPage;
  state.currentPage = page;
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  byId(`page-${page}`)?.classList.add('active');
  ['home', 'shop'].forEach(id => byId(`nl-${id}`)?.classList.toggle('on', id === page));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'shop') {
    applyPresets();
    applyShopFilters();
  }
  observeFU();
}

function renderGrid(id, products) {
  const grid = byId(id);
  if (!grid) return;
  if (!products.length) {
    grid.innerHTML = '<div class="hint-empty" style="grid-column:1/-1">No products match the selected filters.</div>';
    return;
  }
  grid.innerHTML = products.map(renderProduct).join('');
}

function renderProduct(product) {
  return `
    <div class="pcard fade-up" onclick="openDetail(${product.id})">
      <div class="pcard-img">
        <img src="${product.img}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<div class="pbadge ${product.isNew ? 'nb' : product.isSale ? 'sb' : ''}">${product.badge}</div>` : ''}
        <button class="pwish ${state.wishlist.has(product.id) ? 'on' : ''}" onclick="event.stopPropagation();toggleWishlist(${product.id})" aria-label="Toggle wishlist">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-8.84a5.5 5.5 0 0 0 1.06-7.78z"/></svg>
        </button>
        <div class="pquick" onclick="event.stopPropagation();quickAdd(${product.id})">Quick Add</div>
      </div>
      <div class="pinfo">
        <div class="pbrand">${product.brand} · ${product.gender}</div>
        <div class="pname">${product.name}</div>
        <div class="pprice-row">
          <span class="pprice">${money(product.price)}</span>
          ${product.oldPrice ? `<span class="pold">${money(product.oldPrice)}</span>` : ''}
        </div>
      </div>
    </div>`;
}

function renderHome() {
  let filtered = state.products.filter(product => product.isNew || !product.isSale);
  if (state.hGender !== 'All') filtered = filtered.filter(product => product.gender === state.hGender || product.gender === 'Unisex');
  if (state.hCat !== 'all') {
    filtered = filtered.filter(product => {
      if (state.hCat === 'Apparel') return ['Hoodies', 'T-Shirts', 'Shorts'].includes(product.cat);
      return product.cat === state.hCat || product.brand === state.hCat;
    });
  }
  renderGrid('hgrid', filtered.slice(0, 8));
  renderGrid('sgrid', state.products.filter(product => product.isSale).slice(0, 4));
  observeFU();
}

function hGender(el, gender) {
  document.querySelectorAll('.gender-tabs .gtab').forEach(tab => tab.classList.remove('on'));
  el.classList.add('on');
  state.hGender = gender;
  renderHome();
}

function hCat(el, cat) {
  document.querySelectorAll('#hchips .chip').forEach(chip => chip.classList.remove('on'));
  el.classList.add('on');
  state.hCat = cat;
  renderHome();
}

function initShopSidebar() {
  const brandFilters = byId('brand-filters');
  if (brandFilters && state.brands.length) {
    brandFilters.innerHTML = state.brands.slice(0, 8).map(brand => `
      <label class="filter-checkbox">
        <input type="checkbox" value="${brand}" onchange="toggleBrandFilter(this)">
        <span>${brand}</span>
      </label>
    `).join('');
  }
}

function toggleGenderFilter(checkbox) {
  if (checkbox.checked) {
    state.shopFilters.genders.push(checkbox.value);
  } else {
    state.shopFilters.genders = state.shopFilters.genders.filter(g => g !== checkbox.value);
  }
  applyShopFilters();
}

function toggleCategoryFilter(checkbox) {
  if (checkbox.checked) {
    state.shopFilters.categories.push(checkbox.value);
  } else {
    state.shopFilters.categories = state.shopFilters.categories.filter(c => c !== checkbox.value);
  }
  applyShopFilters();
}

function toggleBrandFilter(checkbox) {
  if (checkbox.checked) {
    state.shopFilters.brands.push(checkbox.value);
  } else {
    state.shopFilters.brands = state.shopFilters.brands.filter(b => b !== checkbox.value);
  }
  applyShopFilters();
}

function clearAllFilters() {
  state.shopFilters = {
    genders: [],
    categories: [],
    brands: [],
    minPrice: 0,
    maxPrice: 100000
  };
  document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => cb.checked = false);
  byId('min-price').value = 0;
  byId('max-price').value = 100000;
  applyShopFilters();
}

function applyShopFilters() {
  const sortValue = byId('shop-sort-select')?.value || 'default';
  const minPrice = Number(byId('min-price')?.value || 0);
  const maxPrice = Number(byId('max-price')?.value || 100000);
  
  let filtered = state.products.filter(product => {
    if (state.shopFilters.genders.length > 0) {
      if (!state.shopFilters.genders.includes(product.gender)) return false;
    }
    if (state.shopFilters.categories.length > 0) {
      if (!state.shopFilters.categories.includes(product.cat)) return false;
    }
    if (state.shopFilters.brands.length > 0) {
      if (!state.shopFilters.brands.includes(product.brand)) return false;
    }
    if (product.price < minPrice || product.price > maxPrice) return false;
    return true;
  });
  
  if (sortValue === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortValue === 'newest') {
    filtered.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
  }
  
  byId('shop-results-count').textContent = `${filtered.length} Product${filtered.length === 1 ? '' : 's'}`;
  renderGrid('shop-products-grid', filtered);
}

function applyPresets() {
  if (state.shopGenderPreset) {
    const checkbox = document.querySelector(`.filter-checkbox input[value="${state.shopGenderPreset}"]`);
    if (checkbox) {
      checkbox.checked = true;
      toggleGenderFilter(checkbox);
    }
    state.shopGenderPreset = null;
  }
  if (state.shopCatPreset) {
    state.shopCatPreset = null;
  }
}

function toggleMobileFilters() {
  toggleShopSidebar();
}

function toggleShopSidebar() {
  const sidebar = byId('shop-sidebar');
  const overlay = byId('overlay');
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function applyFilters() {
  // Legacy function - redirects to new one
  applyShopFilters();
}

function filterGender(el, gender) {
  // Legacy function
  applyShopFilters();
}

function gotoShopCat(cat) {
  state.shopCatPreset = cat;
  showPage('shop');
}

function gotoShopGender(gender) {
  state.shopGenderPreset = gender;
  showPage('shop');
}

function gotoShopBrand(brand) {
  showPage('shop');
  setTimeout(() => {
    const checkbox = document.querySelector(`.filter-checkbox input[value="${brand}"]`);
    if (checkbox) {
      checkbox.checked = true;
      toggleBrandFilter(checkbox);
    }
  }, 100);
}

function openDetail(id) {
  const product = productById(id);
  if (!product) return;
  state.detailProduct = product;
  byId('dwrap').innerHTML = `
    <div class="d-img"><img src="${product.img}" alt="${product.name}"></div>
    <div>
      <div class="d-br">${product.brand}</div>
      <div class="d-name">${product.name}</div>
      <div class="d-gtag">${product.gender} · ${product.cat}</div>
      <div class="d-prow">
        <span class="d-price">${money(product.price)}</span>
        ${product.oldPrice ? `<span class="d-old">${money(product.oldPrice)}</span>` : ''}
      </div>
      <p class="d-desc">${product.desc}</p>
      <div class="d-szl">Select Size</div>
      <div class="d-sizes">${product.sizes.map(size => `<div class="d-sz" onclick="selSz(this)">${size}</div>`).join('')}</div>
      <div class="d-acts">
        <button class="btn-bag" onclick="addFromDetail()">Add to Bag</button>
        <button class="btn-w ${state.wishlist.has(product.id) ? 'on' : ''}" onclick="toggleWishlist(${product.id})" aria-label="Toggle wishlist">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-8.84a5.5 5.5 0 0 0 1.06-7.78z"/></svg>
        </button>
      </div>
      <div class="d-meta">
        <div class="d-mrow">Global delivery · White glove service available</div>
        <div class="d-mrow">100% authentic · Certificate included</div>
        <div class="d-mrow">M-Pesa, Visa, Mastercard, or Cash on Delivery</div>
      </div>
    </div>`;
  renderRelatedProducts(product);
  renderProductReviews(product);
  showPage('detail');
}

function renderRelatedProducts(product) {
  const related = state.products
    .filter(p => p.id !== product.id && (p.cat === product.cat || p.brand === product.brand))
    .slice(0, 4);
  renderGrid('related-grid', related);
}

function renderProductReviews(product) {
  const reviews = [
    { author: 'Michael Kamau', stars: 5, text: 'Exceptional quality and authenticity. The certificate provided complete peace of mind. Delivery to Kilimani was seamless.', date: '2 weeks ago', verified: true },
    { author: 'Grace Akinyi', stars: 5, text: 'Absolutely stunning piece. Delivery was fast and packaging was luxurious. Best shopping experience in Nairobi!', date: '1 month ago', verified: true },
    { author: 'David Omondi', stars: 4, text: 'Great product, though sizing runs slightly large. Overall very satisfied with my purchase from Karen.', date: '1 month ago', verified: true }
  ];
  
  byId('product-reviews').innerHTML = reviews.map(review => `
    <div class="review-card">
      <div class="review-header">
        <div>
          <span class="review-author">${review.author}</span>
          ${review.verified ? '<span class="review-verified"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Verified</span>' : ''}
        </div>
        <div class="review-stars">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</div>
      </div>
      <p class="review-text">${review.text}</p>
      <div class="review-date">${review.date}</div>
    </div>`).join('');
}

function selSz(el) {
  document.querySelectorAll('.d-sz').forEach(size => size.classList.remove('on'));
  el.classList.add('on');
}

function addFromDetail() {
  const selected = document.querySelector('.d-sz.on');
  if (!selected) return showToast('Please select a size');
  addToCart(state.detailProduct, selected.textContent);
}

function quickAdd(id) {
  const product = productById(id);
  if (product) addToCart(product, product.sizes[0]);
}

function addToCart(product, size) {
  const existing = state.cart.find(item => item.id === product.id && item.size === size);
  if (existing) existing.qty += 1;
  else state.cart.push({ id: product.id, size, qty: 1 });
  saveCart();
  updateCartUI();
  showToast(`Added - ${product.name}`);
}

function cartItems() {
  return state.cart.map(item => ({ ...productById(item.id), size: item.size, qty: item.qty })).filter(item => item.id);
}

function cartSubtotal() {
  return cartItems().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function deliveryFee(subtotal) {
  return subtotal >= 30000 ? 0 : 250;
}

function updateCartUI() {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  byId('cdot').style.display = count > 0 ? 'block' : 'none';
  const list = byId('cilist');
  const foot = byId('cfoot');
  if (!state.cart.length) {
    list.innerHTML = '<div class="cempty"><div style="font-family:var(--fd);font-size:1.05rem;color:var(--tx2)">Your bag is empty</div><div style="font-size:.73rem;color:var(--tx3);margin-top:.35rem">Add items to get started</div></div>';
    foot.style.display = 'none';
    return;
  }

  list.innerHTML = cartItems().map((item, index) => `
    <div class="ci">
      <div class="ci-img"><img src="${item.img}" alt="${item.name}"></div>
      <div style="flex:1">
        <div class="ci-br">${item.brand}</div>
        <div class="ci-nm">${item.name}</div>
        <div class="ci-mt">Size: ${item.size}</div>
        <div class="ci-row">
          <div class="ci-p">${money(item.price * item.qty)}</div>
          <div class="qc">
            <button class="qbtn" onclick="qc(${index},-1)">-</button>
            <span class="qn">${item.qty}</span>
            <button class="qbtn" onclick="qc(${index},1)">+</button>
          </div>
        </div>
        <span class="ci-rm" onclick="rc(${index})">Remove</span>
      </div>
    </div>`).join('');

  const subtotal = cartSubtotal();
  const fee = deliveryFee(subtotal);
  byId('csub').textContent = money(subtotal);
  document.querySelector('.ct-row:nth-child(2) span:last-child').textContent = fee === 0 ? 'Free' : money(fee);
  byId('ctotal').textContent = money(subtotal + fee);
  foot.style.display = 'block';
}

function qc(index, delta) {
  state.cart[index].qty = Math.max(1, state.cart[index].qty + delta);
  saveCart();
  updateCartUI();
}

function rc(index) {
  state.cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

function closeAll() {
  byId('cdrawer')?.classList.remove('open');
  byId('overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function openCart() {
  updateCartUI();
  byId('cdrawer').classList.add('open');
  byId('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function toggleWishlist(id) {
  if (state.wishlist.has(id)) {
    state.wishlist.delete(id);
    showToast('Removed from wishlist');
  } else {
    state.wishlist.add(id);
    showToast('Saved to wishlist');
  }
  saveWishlist();
  renderHome();
  if (state.currentPage === 'shop') applyShopFilters();
  renderWishlist();
}

function productMatchesQuery(product, q) {
  return [product.brand, product.name, product.cat, product.gender, product.price, ...product.sizes].join(' ').toLowerCase().includes(q.toLowerCase());
}

function renderMiniProduct(product) {
  return `
    <div class="mini-product" onclick="closeModal('search-bg');closeModal('wishlist-bg');openDetail(${product.id})">
      <div class="mini-img"><img src="${product.img}" alt="${product.name}"></div>
      <div>
        <div class="mini-brand">${product.brand} · ${product.cat}</div>
        <div class="mini-name">${product.name}</div>
      </div>
      <div class="mini-price">${money(product.price)}</div>
    </div>`;
}

function openSearch() {
  byId('search-bg').classList.add('open');
  byId('search-input').value = '';
  renderSearch();
  setTimeout(() => byId('search-input').focus(), 50);
}

function renderSearch() {
  const q = byId('search-input').value.trim();
  const results = q ? state.products.filter(product => productMatchesQuery(product, q)).slice(0, 8) : state.products.slice(0, 6);
  byId('search-results').innerHTML = results.length ? results.map(renderMiniProduct).join('') : '<div class="hint-empty">No products found.</div>';
}

function openFirstSearchResult() {
  const q = byId('search-input').value.trim();
  const product = state.products.find(item => q && productMatchesQuery(item, q));
  if (product) {
    closeModal('search-bg');
    openDetail(product.id);
  }
}

function openWishlist() {
  renderWishlist();
  byId('wishlist-bg').classList.add('open');
}

function renderWishlist() {
  const items = [...state.wishlist].map(productById).filter(Boolean);
  byId('wishlist-list').innerHTML = items.length ? items.map(renderMiniProduct).join('') : '<div class="hint-empty">Your wishlist is empty.</div>';
}

function openCheckout() {
  if (!state.cart.length) return showToast('Your bag is empty');
  const subtotal = cartSubtotal();
  const fee = deliveryFee(subtotal);
  byId('cofm').style.display = 'block';
  byId('cook').style.display = 'none';
  byId('co-name').value = state.currentUser?.name || '';
  byId('co-summary').innerHTML = `
    <div class="checkout-line"><span>Items</span><span>${state.cart.reduce((sum, item) => sum + item.qty, 0)}</span></div>
    <div class="checkout-line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
    <div class="checkout-line"><span>Delivery</span><span>${fee === 0 ? 'Free' : money(fee)}</span></div>
    <div class="checkout-line total"><span>Total</span><span>${money(subtotal + fee)}</span></div>`;
  closeAll();
  byId('checkout-bg').classList.add('open');
}

async function placeOrder() {
  const payload = {
    name: byId('co-name').value.trim(),
    phone: byId('co-phone').value.trim(),
    area: byId('co-area').value.trim(),
    pay: byId('co-pay').value,
    email: state.currentUser?.email || '',
    items: state.cart
  };
  if (!payload.name || !payload.phone || !payload.area) return showToast('Please fill in name, phone and delivery area');
  try {
    const { order } = await api('/api/orders', { method: 'POST', body: JSON.stringify(payload) });
    state.orders.unshift(order);
    state.cart = [];
    saveCart();
    updateCartUI();
    byId('cofm').style.display = 'none';
    byId('cook').style.display = 'block';
    byId('co-ok-text').textContent = `${order.id} is confirmed. We will contact ${order.phone} for ${order.pay} payment and delivery to ${order.area}.`;
  } catch (err) {
    showToast(err.message);
  }
}

function openSignIn() {
  byId('signin-bg').classList.add('open');
}

function openSignUp() {
  byId('sufm').style.display = 'block';
  byId('suok').style.display = 'none';
  byId('signup-bg').classList.add('open');
}

function closeModal(id) {
  byId(id)?.classList.remove('open');
}

async function doSignIn() {
  const email = byId('si-em').value.trim();
  const password = byId('si-pw').value.trim();
  if (!email || !password) return showToast('Please fill in all fields');
  try {
    const { user } = await api('/api/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) });
    setUser(user);
    closeModal('signin-bg');
    showToast('Welcome back');
    await loadOrders();
  } catch (err) {
    showToast(err.message);
  }
}

async function doSignUp() {
  const firstName = byId('su-fn').value.trim();
  const lastName = byId('su-ln').value.trim();
  const email = byId('su-em').value.trim();
  const password = byId('su-pw').value.trim();
  if (!firstName || !email || !password) return showToast('Please fill in all fields');
  try {
    const { user } = await api('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name: `${firstName} ${lastName}`.trim(), email, password })
    });
    setUser(user);
    byId('sufm').style.display = 'none';
    byId('suok').style.display = 'block';
  } catch (err) {
    showToast(err.message);
  }
}

function setUser(user, persist = true) {
  state.currentUser = user;
  if (persist) localStorage.setItem(LS.user, JSON.stringify(user));
  byId('auth-out').style.display = 'none';
  byId('auth-in').style.display = 'flex';
  byId('uavatar').textContent = user.name.charAt(0).toUpperCase();
  byId('uname').textContent = user.name;
  byId('uemail').textContent = user.email;
  byId('st-fn').value = user.name;
  byId('st-em').value = user.email;
  byId('st-ph').value = user.phone || '';
}

function signOut() {
  state.currentUser = null;
  state.orders = [];
  localStorage.removeItem(LS.user);
  byId('auth-out').style.display = 'flex';
  byId('auth-in').style.display = 'none';
  closeUDrop();
  showToast('Signed out');
}

function toggleUDrop() {
  byId('udrop').classList.toggle('open');
}

function closeUDrop() {
  byId('udrop').classList.remove('open');
}

function openSettings() {
  byId('settings-bg').classList.add('open');
  switchStab(document.querySelector('.stab'), 'stp');
}

function saveProfile() {
  const name = byId('st-fn').value.trim();
  const email = byId('st-em').value.trim();
  const phone = byId('st-ph').value.trim();
  if (!name || !email) return showToast('Please add a name and email');
  setUser({ ...state.currentUser, name, email, phone });
  showToast('Profile updated');
  closeModal('settings-bg');
}

function switchStab(el, id) {
  document.querySelectorAll('.stab').forEach(tab => tab.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('.ssec').forEach(section => section.classList.remove('on'));
  byId(id).classList.add('on');
}

async function submitNewsletter() {
  const input = document.querySelector('.ft-em');
  const email = input.value.trim();
  try {
    await api('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
    input.value = '';
    showToast('Subscribed - asante');
  } catch (err) {
    showToast(err.message);
  }
}

const INFO = {
  size: ['Support', 'Size Guide', '<p><strong>Sneakers:</strong> EU 37-45. If between sizes, size up for narrow silhouettes.</p><p><strong>Apparel:</strong> XS-XL. Hoodies fit relaxed unless noted.</p>'],
  authenticity: ['Support', 'Authenticity', '<p>Every sneaker is inspected before delivery and includes an authenticity certificate.</p>'],
  shipping: ['Support', 'Shipping Info', '<ul class="info-list"><li>Nairobi: same or next day, KSh 250.</li><li>Nationwide: 2-3 days, from KSh 400.</li><li>Orders above KSh 30,000 get free Nairobi delivery.</li></ul>'],
  returns: ['Support', 'Returns', '<p>Returns are accepted within 7 days when items are unworn, undamaged, and returned with tags, box, and certificate where applicable.</p>'],
  about: ['Company', 'About VALERIAN VAULT', '<p>VALERIAN VAULT is the world\'s most exclusive destination for authenticated luxury fashion, rare collectibles, and bespoke designer pieces.</p>'],
  careers: ['Company', 'Careers', '<p>Send your portfolio or retail experience through the contact channel.</p>'],
  press: ['Company', 'Press', '<p>For press and partnerships, contact the VALERIAN VAULT team with your publication and deadline.</p>'],
  blog: ['Company', 'Blog', '<p>Drop guides, size advice, sourcing notes, and Nairobi style edits are coming soon.</p>'],
  contact: ['Company', 'Contact', '<ul class="info-list"><li>WhatsApp: +254 700 000 000</li><li>Email: concierge@valerianvault.com</li><li>Location: Global Luxury</li></ul>']
};

async function loadOrders() {
  if (!state.currentUser?.email) return;
  try {
    const data = await api(`/api/orders?email=${encodeURIComponent(state.currentUser.email)}`);
    state.orders = data.orders || [];
  } catch {
    state.orders = [];
  }
}

async function openInfo(key) {
  if (key === 'orders') await loadOrders();
  const data = INFO[key] || INFO.about;
  byId('info-label').textContent = key === 'orders' ? 'Account' : data[0];
  byId('info-title').textContent = key === 'orders' ? 'Orders' : data[1];
  if (key === 'orders') {
    byId('info-body').innerHTML = state.orders.length
      ? state.orders.map(order => `<p><strong>${order.id}</strong><br>${money(order.total)} · ${new Date(order.date).toLocaleDateString()}<br>${order.items.length} line item${order.items.length === 1 ? '' : 's'} · ${order.status}</p>`).join('')
      : '<p>No orders yet. Place an order and it will appear here.</p>';
  } else {
    byId('info-body').innerHTML = data[2];
  }
  byId('info-bg').classList.add('open');
}

function openReqModal() {
  byId('reqfm').style.display = 'block';
  byId('reqok').style.display = 'none';
  byId('req-bg').classList.add('open');
}

async function submitReq() {
  const payload = {
    brand: byId('rqbrand').value,
    item: byId('rqitem').value.trim(),
    size: byId('rqsize').value.trim(),
    budget: byId('rqbudget').value.trim(),
    contact: byId('rqcontact').value.trim(),
    notes: byId('rqnotes').value.trim()
  };
  if (!payload.item || !payload.contact) return showToast('Please fill in item and contact');
  try {
    await api('/api/requests', { method: 'POST', body: JSON.stringify(payload) });
    byId('reqfm').style.display = 'none';
    byId('reqok').style.display = 'block';
  } catch (err) {
    showToast(err.message);
  }
}

function toggleAI() {
  state.aiOpen = !state.aiOpen;
  byId('aiwin').classList.toggle('open', state.aiOpen);
  if (state.aiOpen && !state.aiStarted) {
    state.aiStarted = true;
    botMsg("Welcome to VALERIAN VAULT. I'm your luxury concierge. Ask me about exclusive pieces, sizing, or bespoke requests.");
    showChips(['Luxury bags?', "Women's couture?", 'Delivery info', 'Bespoke requests?']);
  }
}

function botMsg(text) {
  const messages = byId('aimsgs');
  const el = document.createElement('div');
  el.className = 'ai-msg b';
  el.innerHTML = '<div class="ai-typing"><div class="ai-d"></div><div class="ai-d"></div><div class="ai-d"></div></div>';
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
  setTimeout(() => {
    el.textContent = text;
    messages.scrollTop = messages.scrollHeight;
  }, 500);
}

function userMsg(text) {
  const messages = byId('aimsgs');
  const el = document.createElement('div');
  el.className = 'ai-msg u';
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function showChips(chips) {
  byId('aichips').innerHTML = chips.map(chip => `<button class="ai-chip" onclick="sendMsg('${chip.replace(/'/g, "\\'")}')">${chip}</button>`).join('');
}

function sendAI() {
  const input = byId('aiinput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  sendMsg(text);
}

async function sendMsg(text) {
  userMsg(text);
  byId('aichips').innerHTML = '';
  try {
    const { reply } = await api('/api/assistant', { method: 'POST', body: JSON.stringify({ message: text }) });
    botMsg(reply);
  } catch {
    botMsg('I could not reach the assistant service. Try again shortly.');
  }
  setTimeout(() => showChips(['Delivery?', 'M-Pesa?', 'Request item?', 'Exclusive pieces?']), 800);
}

function showToast(message) {
  byId('tmsg').textContent = message;
  const toast = byId('toast');
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function observeFU() {
  const els = document.querySelectorAll('.fade-up:not(.vis)');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('vis'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

function bindEvents() {
  document.addEventListener('click', event => {
    const dropdown = document.querySelector('.udrop-wrap');
    if (dropdown && !dropdown.contains(event.target)) closeUDrop();
    const emailPopup = byId('email-popup');
    if (emailPopup && event.target === emailPopup) closeEmailPopup();
  });
  
  // Close cart when clicking overlay
  const overlay = byId('overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      closeAll();
      const sidebar = byId('shop-sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        toggleShopSidebar();
      }
    });
  }
  
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      ['signin-bg', 'signup-bg', 'req-bg', 'settings-bg', 'search-bg', 'wishlist-bg', 'checkout-bg', 'info-bg', 'quickview-bg'].forEach(closeModal);
      closeAll();
      closeEmailPopup();
    }
  });
  ['signin-bg', 'signup-bg', 'req-bg', 'settings-bg', 'search-bg', 'wishlist-bg', 'checkout-bg', 'info-bg', 'quickview-bg'].forEach(id => {
    byId(id)?.addEventListener('click', event => {
      if (event.target.id === id) closeModal(id);
    });
  });
  
  // Swipe down to close cart on mobile
  let startY = 0;
  let startScrollTop = 0;
  const drawer = byId('cdrawer');
  const drawerContent = byId('cilist');
  
  if (drawer && drawerContent) {
    drawer.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
      startScrollTop = drawerContent.scrollTop;
    }, { passive: true });
    
    drawer.addEventListener('touchmove', e => {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      // Only close if swiping down and at top of scroll
      if (diff > 80 && startScrollTop <= 0) {
        closeAll();
      }
    }, { passive: true });
  }
  
  const newsletterButton = document.querySelector('.ft-nlbtn');
  if (newsletterButton) {
    newsletterButton.removeAttribute('onclick');
    newsletterButton.addEventListener('click', submitNewsletter);
  }
}

async function init() {
  loadLocalState();
  bindEvents();
  try {
    await loadProducts();
  } catch (err) {
    showToast('Could not load products from backend');
  }
  initHero();
  initMarquee();
  initShopSidebar();
  renderHome();
  updateCartUI();
  if (state.currentUser) await loadOrders();
  observeFU();
}

function showEmailPopup() {
  if (localStorage.getItem('valerian_email_captured')) return;
  byId('email-popup').classList.add('show');
}

function closeEmailPopup() {
  byId('email-popup').classList.remove('show');
}

async function submitPopupEmail() {
  const email = byId('popup-email').value.trim();
  if (!email.includes('@')) return showToast('Please enter a valid email');
  try {
    await api('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
    localStorage.setItem('valerian_email_captured', 'true');
    closeEmailPopup();
    showToast('Welcome! Check your email for your 15% discount code');
  } catch (err) {
    showToast(err.message);
  }
}

function openQuickView(id) {
  const product = productById(id);
  if (!product) return;
  byId('quickview-content').innerHTML = `
    <div class="quickview-img"><img src="${product.img}" alt="${product.name}"></div>
    <div class="quickview-info">
      <div class="quickview-brand">${product.brand} · ${product.gender}</div>
      <div class="quickview-name">${product.name}</div>
      <div class="quickview-price">${money(product.price)}</div>
      <p class="quickview-desc">${product.desc}</p>
      <div class="quickview-actions">
        <button class="btn-bag" onclick="quickAdd(${product.id});closeModal('quickview-bg')">Quick Add</button>
        <button class="btn-view-full" onclick="closeModal('quickview-bg');openDetail(${product.id})">View Full Details</button>
      </div>
    </div>`;
  byId('quickview-bg').classList.add('open');
}

window.addEventListener('DOMContentLoaded', init);
window.prevPage = state.prevPage;
