import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const STORE_FILE = path.join(__dirname, 'data', 'store.json');

// MIME types for serving static files
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// Initialize data store
async function initStore() {
  try {
    await fs.access(STORE_FILE);
    console.log('Data store found');
  } catch {
    console.log('Creating new data store...');
    await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
    await fs.writeFile(STORE_FILE, JSON.stringify({
      users: [],
      orders: [],
      requests: [],
      newsletter: []
    }, null, 2));
    console.log('Data store created');
  }
}

// Read data from store
async function readStore() {
  const data = await fs.readFile(STORE_FILE, 'utf8');
  return JSON.parse(data);
}

// Write data to store
async function writeStore(data) {
  await fs.writeFile(STORE_FILE, JSON.stringify(data, null, 2));
}

// Handle API requests
async function handleAPI(req, res, pathname) {
  // Set CORS headers
  const setCORS = () => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  };

  setCORS();

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle order creation
  if (pathname === '/api/orders' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const store = await readStore();
        const order = JSON.parse(body);
        order.id = Date.now().toString();
        order.createdAt = new Date().toISOString();
        store.orders.push(order);
        await writeStore(store);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(order));
        console.log(`New order created: #${order.id}`);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to create order' }));
      }
    });
  } 
  // Handle item requests
  else if (pathname === '/api/requests' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const store = await readStore();
        const request = JSON.parse(body);
        request.id = Date.now().toString();
        request.createdAt = new Date().toISOString();
        store.requests.push(request);
        await writeStore(store);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(request));
        console.log(`New item request: ${request.productName || 'Item'}`);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to create request' }));
      }
    });
  } 
  // Handle newsletter subscriptions
  else if (pathname === '/api/newsletter' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const store = await readStore();
        const sub = JSON.parse(body);
        sub.createdAt = new Date().toISOString();
        store.newsletter.push(sub);
        await writeStore(store);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        console.log(`New newsletter subscription: ${sub.email}`);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to subscribe' }));
      }
    });
  } 
  // API endpoint not found
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
  }
}

// Serve static files
async function serveStatic(req, res, pathname) {
  const frontendDir = path.join(__dirname, '..', 'frontend');
  let filePath = path.join(frontendDir, pathname === '/' ? 'index.html' : pathname);

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page Not Found</h1>');
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, `http://localhost:${PORT}`).pathname;

  if (pathname.startsWith('/api/')) {
    await handleAPI(req, res, pathname);
  } else {
    await serveStatic(req, res, pathname);
  }
});

// Start server
await initStore();
server.listen(PORT, () => {
  console.log('\n================================================');
  console.log('   VALERIAN VAULT - Server Running');
  console.log('================================================');
  console.log(`\nServer: http://127.0.0.1:${PORT}`);
  console.log(`Mobile: http://localhost:${PORT}`);
  console.log('\nAvailable routes:');
  console.log('   - http://127.0.0.1:3000/          (Storefront)');
  console.log('   - http://127.0.0.1:3000/login.html (Login)');
  console.log('   - http://127.0.0.1:3000/admin.html (Admin Dashboard)');
  console.log('\nPress Ctrl+C to stop the server\n');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\nError: Port ${PORT} is already in use`);
    console.log('\nTry these solutions:');
    console.log('   1. Kill the process: lsof -ti:3000 | xargs kill -9');
    console.log('   2. Use a different port in server.js\n');
    process.exit(1);
  } else {
    console.error('\nServer error:', error.message);
    process.exit(1);
  }
});
