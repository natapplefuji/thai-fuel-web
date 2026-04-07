# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Thai Fuel Web — a React app for tracking Thailand fuel prices, calculating trip costs, and managing fuel expenses. It has a separate Express backend serving mock fuel price data.

## Commands

### Root (runs both frontend and backend together)
```bash
npm run dev      # Start backend (port 3001) + frontend (port 5173) concurrently
npm run build    # Build frontend for production
npm run start    # Start backend only
```

### Frontend only
```bash
cd frontend
npm run dev      # Vite dev server on port 5173
npm run build    # Production build to frontend/dist/
npm run preview  # Preview the production build
```

### Backend only
```bash
cd backend
npm run dev      # Start Express server on port 3001
```

No tests are currently configured in this project.

## Architecture

**Two-package monorepo** with a root `package.json` that uses `concurrently` to run both:
- `frontend/` — React 18 + Vite, CSS Modules, no TypeScript, no router library
- `backend/` — Express.js, CommonJS, CORS restricted to `localhost:5173`

### Frontend structure
- `src/App.jsx` — root component; owns all state: active section, expenses list, and fuel prices (via `useFuelPrices` hook)
- `src/hooks/useFuelPrices.js` — fetches `GET /api/fuel-prices` and returns `{ prices, loading, error, refetch }`
- `src/components/` — each feature component has its own `.jsx` + `.module.css` file pair
- `src/index.css` — global CSS variables (colors, spacing, shadows, transitions); no Tailwind

**Navigation** is state-driven (no React Router): `App.jsx` tracks `activeSection` and conditionally renders one of four components: `Dashboard`, `FuelCalculator`, `TotalExpenses`, `Contact`.

**Expenses** are stored in React state in `App.jsx` as an array and passed down as props. There is no persistence (no localStorage, no database).

### Backend structure
- `server.js` — Express app with two routes: `GET /api/health` and `GET /api/fuel-prices`
- `data/fuelPrices.js` — static array of 6 Thai fuel types with id, name, shortName, price (THB/litre), color (hex), and description

### API proxy
Vite is configured to proxy `/api/*` → `http://localhost:3001`, so frontend fetch calls use relative paths like `/api/fuel-prices`.

### Styling conventions
- CSS Modules (`.module.css`) for all component styles
- Global design tokens defined as plain CSS custom properties in `src/index.css`
- Primary color: orange `#f97316`; Secondary: green `#16a34a`; fonts: Inter + Sarabun
- Responsive breakpoints handled in each component's module CSS
