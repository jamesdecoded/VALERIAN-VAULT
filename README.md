# VALERIAN VAULT Storefront

Full frontend and backend for the VALERIAN VAULT fashion storefront.

## Structure

```
├── frontend/          # Static files (HTML, CSS, JS)
├── backend/           # Node.js API server
│   ├── server.js      # HTTP server
│   └── data/          # Runtime data storage
└── README.md
```

## Run

From the backend directory:

```bash
cd backend
npm start
```

Open:

```text
http://127.0.0.1:3000
```

## Check

Backend:
```bash
cd backend
npm run check
```

Frontend:
```bash
cd frontend
npm run check
```

## Notes

- Backend uses built-in Node.js modules only
- Backend serves frontend static files automatically
- Runtime data (users, orders, requests, newsletter) stored in `backend/data/store.json`
- CORS enabled for API endpoints
