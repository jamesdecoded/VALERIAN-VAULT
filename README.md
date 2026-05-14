# VALERIAN VAULT

Premium Luxury Fashion Marketplace

A world-class luxury fashion marketplace combining Amazon-level product exploration with SSENSE-style premium aesthetics. Built for the Kenyan market with exceptional mobile experience.

---

## Overview

VALERIAN VAULT is a full-stack e-commerce platform designed for luxury fashion retail. The platform features a sophisticated storefront, comprehensive admin dashboard, and secure authentication system.

**Key Characteristics:**
- Premium glassmorphism design aesthetic
- Mobile-first responsive architecture
- Vanilla JavaScript implementation (no frameworks)
- Node.js backend with file-based storage
- Complete admin management system

---

## Quick Start

### Prerequisites
- Node.js 18 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if any)
npm install

# Start the server
npm start
```

### Access Points

The application will be available at:
- **Storefront:** http://127.0.0.1:3000
- **Login:** http://127.0.0.1:3000/login.html
- **Admin Dashboard:** http://127.0.0.1:3000/admin.html

---

## Authentication

### User Account
```
Email: user@valerianvault.com
Password: user123
```

### Admin Account
```
Email: admin@valerianvault.com
Password: admin123
```

Note: These are demo credentials for development purposes only.

---

## Project Structure

```
VALERIAN-VAULT/
├── backend/
│   ├── data/
│   │   └── store.json          # Auto-generated data storage
│   ├── package.json
│   └── server.js               # Node.js HTTP server
├── frontend/
│   ├── css/
│   │   ├── admin.css           # Admin dashboard styles
│   │   ├── auth.css            # Authentication page styles
│   │   └── styles.css          # Main storefront styles
│   ├── js/
│   │   ├── admin.js            # Admin dashboard logic
│   │   ├── app.js              # Main storefront logic
│   │   └── auth.js             # Authentication logic
│   ├── admin.html              # Admin dashboard
│   ├── index.html              # Main storefront
│   └── login.html              # Authentication page
├── .gitignore
├── package.json
└── README.md
```

---

## Features

### Storefront Features

**Product Discovery**
- Advanced filtering system (category, price range)
- Real-time search functionality
- Quick view product modal
- Category-based navigation
- Trending products section

**Shopping Experience**
- Interactive shopping cart with persistence
- Size selection for products
- Real-time cart updates
- Smooth sidebar animations
- Toast notifications for user feedback

**Hero Slideshow**
- Auto-play functionality (5-second intervals)
- Manual navigation controls
- Indicator dots for slide position
- Fully customizable from admin dashboard
- Mobile-optimized touch controls

**Item Request System**
- Custom product request form
- Image upload capability
- WhatsApp integration
- Budget specification
- Size and brand preferences

### Admin Dashboard Features

**Product Management**
- Create, read, update, delete operations
- Image URL management
- Category assignment
- Price management
- Trending product designation
- Size availability tracking

**Order Management**
- View all customer orders
- Order details display
- Payment method tracking
- Order date and time stamps

**Request Management**
- View customer item requests
- Contact information access
- Budget and preference tracking
- Product link references

**Homepage Control**
- Manage hero slideshow slides
- Add/edit/delete slides
- Customize slide content
- Set button actions and links

**Dashboard Analytics**
- Total products count
- Total orders count
- Item requests count
- Revenue tracking

---

## Technical Stack

### Frontend
- HTML5 (semantic markup)
- CSS3 (glassmorphism, animations, grid/flexbox)
- Vanilla JavaScript (ES6+)
- Google Fonts (Playfair Display, Inter)

### Backend
- Node.js (built-in modules only)
- HTTP server
- File system for data storage
- JSON-based data structure
- CORS-enabled API endpoints

### Design System

**Color Palette**
```css
--dark: #050505          /* Primary background */
--dark-alt: #0a0a0a      /* Alternative dark */
--dark-light: #121212    /* Lighter dark */
--gold: #d4af37          /* Accent color */
--glass: rgba(255, 255, 255, 0.03)
--glass-hover: rgba(255, 255, 255, 0.06)
--glass-border: rgba(255, 255, 255, 0.08)
```

**Typography**
- Headings: Playfair Display (400, 600, 700)
- Body: Inter (300, 400, 500, 600, 700)
- Responsive sizing with clamp()

**Spacing**
- Section padding: 6rem vertical
- Container max-width: 1400px (standard), 1600px (wide)
- Grid gap: 2rem (desktop), 1.5rem (tablet), 1rem (mobile)

---

## Responsive Breakpoints

```css
Desktop (>1200px):  4-5 column grid, full features
Tablet (968-1200px): 3 column grid, adapted spacing
Mobile (640-968px):  2 column grid, simplified layout
Small (<640px):      2 column grid, mobile-optimized
```

---

## API Endpoints

### POST /api/orders
Create a new order

**Request Body:**
```json
{
  "items": [],
  "total": 0,
  "paymentMethod": "string"
}
```

### POST /api/requests
Submit an item request

**Request Body:**
```json
{
  "productName": "string",
  "brand": "string",
  "size": "string",
  "budget": "number",
  "whatsapp": "string"
}
```

### POST /api/newsletter
Subscribe to newsletter

**Request Body:**
```json
{
  "email": "string"
}
```

---

## Data Storage

All application data is stored in `backend/data/store.json`:

```json
{
  "users": [],
  "orders": [],
  "requests": [],
  "newsletter": []
}
```

The file is automatically created on first server start if it doesn't exist.

---

## Development

### Running the Server

```bash
# From root directory
npm start

# Or from backend directory
cd backend && npm start
```

### Stopping the Server

Press `Ctrl + C` in the terminal running the server.

### Port Already in Use

If port 3000 is already in use:

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Then restart the server
npm start
```

---

## Browser Support

**Tested and Compatible:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

**Mobile Browsers:**
- iOS Safari 14+
- Android Chrome 90+
- Samsung Internet 14+

---

## Performance Optimizations

- Lazy loading for images
- GPU-accelerated CSS animations
- Debounced search input
- LocalStorage for cart persistence
- Minimal JavaScript bundle
- No external dependencies (except fonts)

---

## Security Considerations

**Current Implementation (Development Only):**

This is a demonstration project with client-side authentication. The following security measures are NOT implemented:

- Password hashing
- JWT token authentication
- Backend session management
- Rate limiting
- Input sanitization
- CSRF protection
- HTTPS/SSL

**Production Requirements:**

Before deploying to production, implement:

1. Backend authentication system with JWT
2. Password hashing (bcrypt or similar)
3. HTTPS/SSL certificates
4. Environment variables for sensitive data
5. Rate limiting on API endpoints
6. Input validation and sanitization
7. CSRF token protection
8. Database integration (MongoDB, PostgreSQL, etc.)
9. Proper session management
10. Security headers

---

## Customization

### Changing Colors

Edit `frontend/css/styles.css`:

```css
:root {
  --gold: #d4af37;        /* Change accent color */
  --dark: #050505;        /* Change background */
}
```

### Adding Products

1. Login as admin
2. Navigate to Products section
3. Click "Add Product"
4. Fill in product details
5. Save

### Modifying Hero Slides

1. Login as admin
2. Navigate to Homepage section
3. Add, edit, or delete slides
4. Changes appear immediately on storefront

---

## Troubleshooting

### Server Won't Start

Check Node.js version:
```bash
node --version
```

Ensure version is 18 or higher.

### Page Not Loading

Verify server is running and check console for errors.

### Admin Dashboard Not Accessible

Ensure you're logged in with admin credentials. Clear browser cache if issues persist.

### Cart Not Persisting

Check browser LocalStorage is enabled and not full.

---

## File Size Reference

- JavaScript: ~1,752 lines total
- CSS: ~3 files, comprehensive styling
- HTML: 3 pages, semantic markup
- Dependencies: 0 npm packages (vanilla implementation)

---

## License

This project is for educational and demonstration purposes.

---

## Credits

Designed and developed for the Kenyan market, combining global luxury fashion with local accessibility.

---

## Version

Current Version: 2.0.0

---

## Contact

For support or inquiries, refer to the WhatsApp integration within the application.
