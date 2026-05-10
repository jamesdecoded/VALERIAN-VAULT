const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';
const ROOT = path.join(__dirname, '..', 'frontend');
const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const products = [
  { id: 1, brand: 'Nike', name: "Air Force 1 '07 White", cat: 'Sneakers', gender: 'Unisex', price: 12500, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'], badge: 'New', isNew: true, desc: "The AF1 '07 with white leather, stitched overlays, and a low-cut profile." },
  { id: 2, brand: 'Nike', name: 'Air Max 90 Infrared', cat: 'Sneakers', gender: 'Men', price: 18000, oldPrice: 22000, img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80', sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43'], badge: 'Sale', isSale: true, desc: 'Visible Air cushioning, sculpted midsole, and infrared detailing.' },
  { id: 3, brand: 'Adidas', name: 'Samba OG White Gum', cat: 'Sneakers', gender: 'Unisex', price: 14500, img: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80', sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43'], badge: 'New', isNew: true, desc: 'White leather, suede panels, and gum sole.' },
  { id: 4, brand: 'Adidas', name: 'Gazelle Indoor Blue', cat: 'Sneakers', gender: 'Women', price: 13000, oldPrice: 15500, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80', sizes: ['EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41'], badge: 'Sale', isSale: true, desc: 'Blue suede, perforated toe cap, and indoor sole.' },
  { id: 5, brand: 'Jordan', name: 'Air Jordan 1 High Bred', cat: 'Sneakers', gender: 'Men', price: 28000, img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80', sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43'], badge: 'New', isNew: true, desc: 'Black and red leather with certificate included.' },
  { id: 6, brand: 'New Balance', name: '990v6 Grey Made in USA', cat: 'Sneakers', gender: 'Men', price: 23000, img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80', sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43'], badge: 'New', isNew: true, desc: 'ENCAP midsole with pigskin suede upper.' },
  { id: 7, brand: 'Converse', name: 'Chuck Taylor All Star', cat: 'Sneakers', gender: 'Unisex', price: 7000, img: 'https://images.unsplash.com/photo-1494496195158-c3bc573a5543?w=600&q=80', sizes: ['EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42'], desc: 'Black canvas with vulcanised sole.' },
  { id: 8, brand: 'ASICS', name: 'Gel-Kayano 14 Cream', cat: 'Sneakers', gender: 'Women', price: 16500, oldPrice: 20000, img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80', sizes: ['EU 37', 'EU 38', 'EU 39', 'EU 40'], badge: 'Sale', isSale: true, desc: 'Retro runner in a cream colourway.' },
  { id: 9, brand: 'Nike', name: 'Tech Fleece Hoodie', cat: 'Hoodies', gender: 'Men', price: 9500, img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80', sizes: ['S', 'M', 'L', 'XL'], badge: 'New', isNew: true, desc: 'Engineered warmth without excess bulk.' },
  { id: 10, brand: 'Corteiz', name: 'CRTZ RTW Hoodie', cat: 'Hoodies', gender: 'Unisex', price: 15000, img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80', sizes: ['S', 'M', 'L'], badge: 'New', isNew: true, desc: 'Heavyweight cotton with Alcatraz logo.' },
  { id: 11, brand: 'The North Face', name: 'Nuptse Jacket Black', cat: 'Hoodies', gender: 'Unisex', price: 32000, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80', sizes: ['S', 'M', 'L', 'XL'], badge: 'New', isNew: true, desc: '700-fill down insulation and box logo.' },
  { id: 12, brand: 'Adidas', name: 'Trefoil Hoodie Burgundy', cat: 'Hoodies', gender: 'Women', price: 8500, img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80', sizes: ['XS', 'S', 'M', 'L'], desc: 'Classic Trefoil hoodie in deep burgundy.' },
  { id: 13, brand: 'Nike', name: 'Dri-FIT Shorts', cat: 'Shorts', gender: 'Men', price: 3800, img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80', sizes: ['S', 'M', 'L', 'XL'], desc: 'Breathable Dri-FIT shorts built for movement.' },
  { id: 14, brand: 'Adidas', name: '3-Stripe Tee White', cat: 'T-Shirts', gender: 'Unisex', price: 3200, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', sizes: ['XS', 'S', 'M', 'L', 'XL'], desc: 'Essential Adidas logo tee.' },
  { id: 15, brand: 'Carhartt', name: 'WIP Chase Hoodie', cat: 'Hoodies', gender: 'Men', price: 13500, img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80', sizes: ['S', 'M', 'L', 'XL'], desc: 'Workwear credibility meets street culture.' },
  { id: 16, brand: 'Nike', name: 'Brasilia Backpack', cat: 'Bags', gender: 'Unisex', price: 6500, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', sizes: ['One Size'], badge: 'New', isNew: true, desc: 'Durable nylon, padded straps, and shoe pocket.' },
  { id: 17, brand: 'Adidas', name: 'Classic 3-Stripe Backpack', cat: 'Bags', gender: 'Unisex', price: 5800, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', sizes: ['One Size'], desc: 'Signature 3-stripe panels with water-resistant base.' },
  { id: 18, brand: 'The North Face', name: 'Jester Backpack Navy', cat: 'Bags', gender: 'Unisex', price: 12000, img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80', sizes: ['One Size'], badge: 'New', isNew: true, desc: 'FlexVent suspension, laptop sleeve, and 28L capacity.' },
  { id: 19, brand: 'Carhartt', name: 'WIP Payton Hip Bag', cat: 'Bags', gender: 'Unisex', price: 7500, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', sizes: ['One Size'], desc: 'Recycled polyester with adjustable strap.' },
  { id: 20, brand: 'Nike', name: 'Heritage 86 Cap', cat: 'Caps', gender: 'Unisex', price: 2500, img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80', sizes: ['One Size'], desc: 'Nike Futura logo, unstructured 6-panel cap.' },
  { id: 21, brand: 'New Balance', name: '574 Navy', cat: 'Sneakers', gender: 'Women', price: 11000, oldPrice: 13500, img: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80', sizes: ['EU 37', 'EU 38', 'EU 39', 'EU 40'], badge: 'Sale', isSale: true, desc: 'The 574 in navy suede.' },
  { id: 22, brand: 'Puma', name: 'Suede Classic', cat: 'Sneakers', gender: 'Unisex', price: 8500, img: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=600&q=80', sizes: ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42'], desc: 'Low profile suede street classic.' },
  { id: 23, brand: 'Vans', name: 'Old Skool White', cat: 'Sneakers', gender: 'Unisex', price: 7500, img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80', sizes: ['EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41'], desc: 'Iconic side stripe and waffle outsole.' },
  { id: 24, brand: 'Timberland', name: '6-Inch Boot Wheat', cat: 'Sneakers', gender: 'Men', price: 19000, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43'], desc: 'Waterproof wheat nubuck boot.' },
  { id: 25, brand: 'Jordan', name: 'Air Jordan 4 Military Blue', cat: 'Sneakers', gender: 'Men', price: 30000, img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80', sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'], badge: 'New', isNew: true, desc: 'White leather, neutral grey overlays, and military blue accents.' },
  { id: 26, brand: 'Reebok', name: 'Classic Leather White', cat: 'Sneakers', gender: 'Unisex', price: 8200, oldPrice: 10500, img: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80', sizes: ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42'], badge: 'Sale', isSale: true, desc: 'Soft leather upper and EVA midsole.' },
  { id: 27, brand: 'Saucony', name: 'Shadow 6000 Grey', cat: 'Sneakers', gender: 'Unisex', price: 14000, img: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&q=80', sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43'], desc: 'Retro runner with cushioned midsole and suede mesh upper.' }
];

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

function seedStore() {
  return { users: [], orders: [], requests: [], newsletter: [] };
}

function loadStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(seedStore(), null, 2));
  }
  try {
    return { ...seedStore(), ...JSON.parse(fs.readFileSync(STORE_PATH, 'utf8')) };
  } catch {
    return seedStore();
  }
}

let store = loadStore();

function saveStore() {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function send(res, status, data, headers = {}) {
  const body = typeof data === 'string' ? data : JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': typeof data === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    ...headers
  });
  res.end(body);
}

function sendJson(res, status, data) {
  send(res, status, data, { 'Cache-Control': 'no-store' });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone || '' };
}

function filterProducts(searchParams) {
  let result = [...products];
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const brand = searchParams.get('brand');
  const category = searchParams.get('category');
  const gender = searchParams.get('gender');
  const size = searchParams.get('size');
  const maxPrice = Number(searchParams.get('maxPrice') || 0);
  const sort = searchParams.get('sort') || 'featured';

  if (q) {
    result = result.filter(p => [p.brand, p.name, p.cat, p.gender, p.desc, ...p.sizes].join(' ').toLowerCase().includes(q));
  }
  if (brand) result = result.filter(p => p.brand === brand);
  if (category) result = result.filter(p => category === 'Apparel' ? ['Hoodies', 'T-Shirts', 'Shorts'].includes(p.cat) : p.cat === category);
  if (gender && gender !== 'All') result = result.filter(p => p.gender === gender || p.gender === 'Unisex');
  if (size) result = result.filter(p => p.sizes.includes(size));
  if (maxPrice > 0) result = result.filter(p => p.price <= maxPrice);
  if (searchParams.get('sale') === 'true') result = result.filter(p => p.isSale);
  if (searchParams.get('new') === 'true') result = result.filter(p => p.isNew);

  if (sort === 'asc') result.sort((a, b) => a.price - b.price);
  if (sort === 'desc') result.sort((a, b) => b.price - a.price);
  if (sort === 'new') result.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
  return result;
}

function cartTotals(items) {
  const normalized = [];
  for (const line of items || []) {
    const product = products.find(p => p.id === Number(line.id));
    const qty = Math.max(1, Math.min(20, Number(line.qty || 1)));
    const size = String(line.size || product?.sizes?.[0] || '').trim();
    if (!product || !product.sizes.includes(size)) continue;
    normalized.push({ id: product.id, brand: product.brand, name: product.name, img: product.img, size, qty, price: product.price });
  }
  const subtotal = normalized.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal >= 30000 ? 0 : 250;
  return { items: normalized, subtotal, delivery, total: subtotal + delivery };
}

function assistantReply(message) {
  const text = String(message || '').toLowerCase();
  if (/bag|backpack|carry/.test(text)) return 'Bags in stock include Nike Brasilia, Adidas Classic, The North Face Jester, and Carhartt Payton Hip Bag.';
  if (/deliver|ship/.test(text)) return 'Nairobi delivery is KSh 250 and usually same or next day. Orders over KSh 30,000 get free Nairobi delivery.';
  if (/mpesa|m-pesa|pay/.test(text)) return 'M-Pesa is available at checkout. We also support Visa, Mastercard, and Cash on Delivery.';
  if (/size|fit|eu/.test(text)) return 'Sneakers use EU sizing and apparel uses XS-XL. If between sizes, size up for Samba and Gazelle.';
  if (/auth|real|fake|legit/.test(text)) return 'All products are authenticated before delivery. Sneakers include a certificate.';
  if (/sale|discount|offer/.test(text)) return 'Current sale items include Nike Air Max 90, Adidas Gazelle, ASICS Gel-Kayano, New Balance 574, and Reebok Classic.';
  if (/women|female|her/.test(text)) return "Women's picks include Adidas Gazelle, ASICS Gel-Kayano 14, New Balance 574, and Adidas Trefoil Hoodie.";
  if (/men|male|his/.test(text)) return "Men's picks include Air Jordan 1, New Balance 990v6, Nike Air Max 90, and Timberland 6-Inch Boot.";
  return 'Ask about brands, sizing, delivery, M-Pesa, authenticity, bags, apparel, or sourcing requests.';
}

async function handleApi(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, products: products.length });
  }

  if (req.method === 'GET' && url.pathname === '/api/products') {
    const brands = [...new Set(products.map(p => p.brand))].sort();
    const categories = [...new Set(products.map(p => p.cat))].sort();
    return sendJson(res, 200, { products: filterProducts(url.searchParams), brands, categories });
  }

  const productMatch = url.pathname.match(/^\/api\/products\/(\d+)$/);
  if (req.method === 'GET' && productMatch) {
    const product = products.find(p => p.id === Number(productMatch[1]));
    return product ? sendJson(res, 200, { product }) : sendJson(res, 404, { error: 'Product not found' });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/signup') {
    const body = await readBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const name = String(body.name || body.firstName || '').trim();
    if (!name || !email) return sendJson(res, 400, { error: 'Name and email are required' });
    let user = store.users.find(u => u.email === email);
    if (!user) {
      user = { id: `usr_${Date.now()}`, name, email, phone: body.phone || '', createdAt: new Date().toISOString() };
      store.users.push(user);
      saveStore();
    }
    return sendJson(res, 201, { user: publicUser(user), token: user.id });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/signin') {
    const body = await readBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    if (!email) return sendJson(res, 400, { error: 'Email is required' });
    let user = store.users.find(u => u.email === email);
    if (!user) {
      const name = email.split('@')[0] || 'Customer';
      user = { id: `usr_${Date.now()}`, name: name.charAt(0).toUpperCase() + name.slice(1), email, createdAt: new Date().toISOString() };
      store.users.push(user);
      saveStore();
    }
    return sendJson(res, 200, { user: publicUser(user), token: user.id });
  }

  if (req.method === 'GET' && url.pathname === '/api/orders') {
    const email = String(url.searchParams.get('email') || '').toLowerCase();
    const orders = email ? store.orders.filter(o => o.email === email) : store.orders;
    return sendJson(res, 200, { orders });
  }

  if (req.method === 'POST' && url.pathname === '/api/orders') {
    const body = await readBody(req);
    const totals = cartTotals(body.items);
    if (!totals.items.length) return sendJson(res, 400, { error: 'Order has no valid items' });
    if (!body.name || !body.phone || !body.area) return sendJson(res, 400, { error: 'Name, phone, and delivery area are required' });
    const order = {
      id: `VV-${Date.now().toString().slice(-6)}`,
      name: String(body.name).trim(),
      email: String(body.email || '').trim().toLowerCase(),
      phone: String(body.phone).trim(),
      area: String(body.area).trim(),
      pay: String(body.pay || 'M-Pesa'),
      ...totals,
      status: 'Confirmed',
      date: new Date().toISOString()
    };
    store.orders.unshift(order);
    saveStore();
    return sendJson(res, 201, { order });
  }

  if (req.method === 'POST' && url.pathname === '/api/requests') {
    const body = await readBody(req);
    if (!body.item || !body.contact) return sendJson(res, 400, { error: 'Item and contact are required' });
    const request = { id: `REQ-${Date.now().toString().slice(-6)}`, ...body, date: new Date().toISOString(), status: 'New' };
    store.requests.unshift(request);
    saveStore();
    return sendJson(res, 201, { request });
  }

  if (req.method === 'POST' && url.pathname === '/api/newsletter') {
    const body = await readBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    if (!email.includes('@')) return sendJson(res, 400, { error: 'Valid email is required' });
    if (!store.newsletter.includes(email)) store.newsletter.push(email);
    saveStore();
    return sendJson(res, 201, { ok: true });
  }

  if (req.method === 'POST' && url.pathname === '/api/assistant') {
    const body = await readBody(req);
    return sendJson(res, 200, { reply: assistantReply(body.message) });
  }

  return sendJson(res, 404, { error: 'API route not found' });
}

function serveStatic(res, pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.normalize(path.join(ROOT, requested));
  if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden');
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Not found');
    const type = mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }
  try {
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
    return serveStatic(res, url.pathname);
  } catch (err) {
    return sendJson(res, 500, { error: err.message || 'Server error' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`VALERIAN VAULT app running at http://${HOST}:${PORT}`);
});
