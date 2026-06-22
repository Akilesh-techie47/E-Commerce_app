# E-Commerce_app

ShopNow — a simple full-stack e-commerce demo with a React frontend and an Express/MongoDB backend. It supports product listing, cart, checkout/order creation, authentication (JWT), and basic admin actions.

## Stack
- Language(s): JavaScript (React frontend, Node/Express backend)
- Frontend: Create React App (React 19)
- Backend: Node.js + Express, MongoDB via Mongoose
- Notable libraries: axios (frontend), react-router-dom, mongoose, jsonwebtoken, bcryptjs

## Repository layout
```
frontend/        React app (CRA) - UI, pages, contexts, api helper
backend/         Express API - models, controllers, routes, middleware
tools/           utility scripts (seeders, generators)
```

## Quick start (development)
Prerequisites:
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

1. Clone the repository

```bash
git clone https://github.com/Akilesh-techie47/E-Commerce_app.git
cd E-Commerce_app
```

2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET
npm install
npm run dev   # uses nodemon (dev) or `npm start` runs server.js
```

The backend listens on PORT (default 5000). API base URL: http://localhost:5000/api

3. Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The frontend runs at http://localhost:3000 and talks to the backend at http://localhost:5000/api (default). If you changed the backend host, update `frontend/src/api/axios.js` or set a proxy.

## Environment variables
Copy `backend/.env.example` to `backend/.env` and update values:
- MONGO_URI — MongoDB connection string
- JWT_SECRET — secret used to sign JSON Web Tokens
- PORT — optional backend port

## Seeding / sample data
See `tools/` for any provided seed scripts. You can also create products via the API (admin) or by using a provided generator script in `tools/seed` (if present).

## Important routes (backend)
- POST /api/auth/register — register a new user
- POST /api/auth/login — login and receive a JWT token
- GET /api/products — list products
- GET /api/products/:id — product detail
- POST /api/orders — create order (protected, requires Authorization: Bearer <token>)
- GET /api/orders/myorders — get orders for logged-in user (protected)

## Notes & troubleshooting
- If orders are not saving: ensure the frontend sends Authorization header (token stored in localStorage after login). The backend requires a valid JWT for POST /api/orders.
- If you see a blank page after navigation: check frontend routing (App.js) and that the route component exports the expected content (e.g., `OrdersPage` should render actual orders, not a placeholder).
- Check browser DevTools Network tab to inspect POST /api/orders requests (payload, headers, response).

## Development tips
- The frontend axios instance (`frontend/src/api/axios.js`) sets Authorization from localStorage on each request via an interceptor. Make sure login stores `token` and `user` in localStorage.
- The backend `authMiddleware.protect` decodes the JWT and attaches `req.user` (with id and role) to requests.

## License
MIT

## Contact
Repository owner: @Akilesh-techie47

